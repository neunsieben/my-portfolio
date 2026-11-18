// Video helpers for the portfolio (macOS, AVFoundation only).
//
//   swift scripts/video-tools.swift encode <in.mp4> <out.mp4> [maxWidth] [maxHeight]
//     Re-encodes to H.264 High, no audio, scaled to fit maxWidth x maxHeight
//     (default 2400x1800). iPhones cannot decode H.264 frames above ~9.4M
//     pixels (e.g. 4000x3000), so keep web videos at or below this size.
//
//   swift scripts/video-tools.swift poster <in.mp4> <out.jpg> [seconds]
//     Writes a JPEG frame (default 0.5s) used as the <video> poster.
import AVFoundation
import CoreImage
import ImageIO
import UniformTypeIdentifiers

func fail(_ msg: String) -> Never {
    FileHandle.standardError.write((msg + "\n").data(using: .utf8)!)
    exit(1)
}

func even(_ v: Double) -> Int { max(2, Int(v.rounded(.down)) & ~1) }

func encode(_ input: URL, _ output: URL, maxW: Double, maxH: Double) async throws {
    let asset = AVURLAsset(url: input)
    guard let track = try await asset.loadTracks(withMediaType: .video).first else {
        fail("no video track")
    }
    let natural = try await track.load(.naturalSize)
    let transform = try await track.load(.preferredTransform)
    let fps = try await track.load(.nominalFrameRate)
    let oriented = natural.applying(transform)
    let srcW = abs(oriented.width), srcH = abs(oriented.height)
    let scale = min(1, maxW / srcW, maxH / srcH)
    let outW = even(srcW * scale), outH = even(srcH * scale)

    try? FileManager.default.removeItem(at: output)
    let reader = try AVAssetReader(asset: asset)

    let comp = AVMutableVideoComposition()
    comp.renderSize = CGSize(width: outW, height: outH)
    comp.frameDuration = CMTime(value: 1, timescale: CMTimeScale(max(1, fps.rounded())))
    let instr = AVMutableVideoCompositionInstruction()
    instr.timeRange = CMTimeRange(start: .zero, duration: try await asset.load(.duration))
    let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
    let fit = CGAffineTransform(scaleX: CGFloat(outW) / srcW, y: CGFloat(outH) / srcH)
    layer.setTransform(transform.concatenating(fit), at: .zero)
    instr.layerInstructions = [layer]
    comp.instructions = [instr]

    let compOut = AVAssetReaderVideoCompositionOutput(videoTracks: [track], videoSettings: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    ])
    compOut.videoComposition = comp
    reader.add(compOut)

    let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let bitrate = Int(Double(outW * outH) * Double(max(fps, 24)) * 0.06)
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: outW,
        AVVideoHeightKey: outH,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: bitrate,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoMaxKeyFrameIntervalKey: Int(max(fps, 24)),
        ],
    ])
    input.expectsMediaDataInRealTime = false
    writer.add(input)

    guard reader.startReading() else { fail("reader: \(String(describing: reader.error))") }
    guard writer.startWriting() else { fail("writer: \(String(describing: writer.error))") }
    writer.startSession(atSourceTime: .zero)

    let queue = DispatchQueue(label: "encode")
    await withCheckedContinuation { (done: CheckedContinuation<Void, Never>) in
        input.requestMediaDataWhenReady(on: queue) {
            while input.isReadyForMoreMediaData {
                if let sample = compOut.copyNextSampleBuffer() {
                    input.append(sample)
                } else {
                    input.markAsFinished()
                    done.resume()
                    return
                }
            }
        }
    }
    await writer.finishWriting()
    if writer.status != .completed { fail("write failed: \(String(describing: writer.error))") }
    print("\(output.lastPathComponent): \(outW)x\(outH) @ \(bitrate / 1000) kbps")
}

func poster(_ input: URL, _ output: URL, at seconds: Double) async throws {
    let gen = AVAssetImageGenerator(asset: AVURLAsset(url: input))
    gen.appliesPreferredTrackTransform = true
    gen.requestedTimeToleranceBefore = .zero
    gen.requestedTimeToleranceAfter = .zero
    gen.maximumSize = CGSize(width: 1600, height: 1600)
    let (image, _) = try await gen.image(at: CMTime(seconds: seconds, preferredTimescale: 600))
    guard let dest = CGImageDestinationCreateWithURL(
        output as CFURL, UTType.jpeg.identifier as CFString, 1, nil)
    else { fail("cannot write \(output.path)") }
    CGImageDestinationAddImage(dest, image, [kCGImageDestinationLossyCompressionQuality: 0.8] as CFDictionary)
    CGImageDestinationFinalize(dest)
    print("\(output.lastPathComponent): \(image.width)x\(image.height)")
}

let args = CommandLine.arguments
guard args.count >= 4 else {
    fail("usage: video-tools.swift encode <in> <out> [maxW] [maxH] | poster <in> <out.jpg> [seconds]")
}
let input = URL(fileURLWithPath: args[2]), output = URL(fileURLWithPath: args[3])
let sem = DispatchSemaphore(value: 0)
Task {
    do {
        switch args[1] {
        case "encode":
            let w = args.count > 4 ? Double(args[4]) ?? 2400 : 2400
            let h = args.count > 5 ? Double(args[5]) ?? 1800 : 1800
            try await encode(input, output, maxW: w, maxH: h)
        case "poster":
            try await poster(input, output, at: args.count > 4 ? Double(args[4]) ?? 0.5 : 0.5)
        default:
            fail("unknown command \(args[1])")
        }
    } catch {
        fail("error: \(error)")
    }
    sem.signal()
}
sem.wait()
