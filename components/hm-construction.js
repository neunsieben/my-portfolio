/*!
 * <hm-construction> — Henning Media logo construction, animated, in a 4:3 frame.
 *
 *   <script src="hm-construction.js" defer></script>
 *   <hm-construction variant="mark"></hm-construction>
 *   <hm-construction variant="horizontal" loop></hm-construction>
 *   <hm-construction variant="stacked" captions="off"></hm-construction>
 *
 * Attributes
 *   variant    mark | horizontal | stacked            (default: mark)
 *   loop       replay after the final hold
 *   autoplay   "off" to stop it playing when scrolled into view
 *   captions   "off" to hide the step caption
 *
 * Methods      el.play()  el.stop()  el.goTo(step)    step 0 = empty frame
 * Event        "hm-step"  (detail: { step, total })
 * Click / Enter replays.
 *
 * Theme with CSS custom properties on the element or any ancestor:
 *   --hm-ink      logo colour            (default: currentColor)
 *   --hm-guide    construction lines     (default: #E8452C)
 *   --hm-measure  dimension lines, text  (default: #6B7075)
 *   --hm-bg       frame background       (default: transparent)
 *   --hm-font     annotation font        (default: system monospace)
 *
 * Width comes from your layout; height follows at 4:3.
 */
(function () {
  if (typeof window === 'undefined' || !window.customElements || customElements.get('hm-construction')) return;

  var MARK = 'M105.2 1148.3 383.5 1018.6 455.7 678.7 610.6 678.7 555.4 938.4 727.4 858.3 837.8 338.9 700.0 258.5 644.8 518.2 489.8 518.2 562.1 178.1 339.0 48.1 Z M899.5 374.8 999.2 433.0 899.5 678.7 Z M1005.7 728.6 1284.0 599.0 1060.9 468.9 Z';
  var WORD = 'M1786.2769230769231 468.9 1754.5278846153847 728.6H1711.7201923076923L1725.6326923076924 618.0134615384616H1600.0634615384615L1586.5076923076924 728.6H1543.7L1575.4490384615385 468.9H1618.2567307692307L1605.0576923076924 577.7028846153846H1730.2701923076925L1743.4692307692308 468.9ZM1957.533111583191 468.9H2129.8340731216526L2125.1965731216524 507.42692307692306H1995.7033038908833L1987.1417654293448 578.7730769230769H2102.0090731216524L2097.0148423524215 618.0134615384616H1982.147534660114L1973.5859961985755 689.0028846153846H2108.0734961985754L2103.0792654293446 728.6H1925.7840731216525ZM2488.017184704843 737.875H2486.946992397151L2322.1373770125356 555.9423076923076L2301.446992397151 728.6H2260.066223166382L2292.8854539356125 459.98173076923075H2294.6691077817663L2458.76526162792 644.4115384615385L2479.4556462433047 468.9H2520.8364154740743ZM2888.2945270572645 737.875H2887.2243347495723L2722.414719364957 555.9423076923076L2701.7243347495723 728.6H2660.343565518803L2693.162796288034 459.98173076923075H2694.9464501341877L2859.0426039803415 644.4115384615385L2879.732988595726 468.9H2921.1137578264957ZM3092.3699463327634 468.9H3135.177638640456L3103.4286001789173 728.6H3060.620907871225ZM3502.635750223646 737.875H3501.565557915954L3336.7559425313384 555.9423076923076L3316.065557915954 728.6H3274.6847886851847L3307.5040194544154 459.98173076923075H3309.287673300569L3473.383827146723 644.4115384615385L3494.0742117621076 468.9H3535.454980992877ZM3886.1467464222223 710.7634615384616Q3879.012131037607 716.4711538461538 3864.9212656529917 721.4653846153847Q3850.8304002683763 726.4596153846154 3834.420784883761 729.4918269230769Q3818.0111694991456 732.5240384615385 3803.028477191453 732.5240384615385Q3792.6832848837607 732.5240384615385 3779.305881037607 729.8485576923076Q3765.928477191453 727.1730769230769 3751.480881037607 721.64375Q3737.0332848837606 716.1144230769231 3723.4775156529913 707.0177884615384Q3709.9217464222224 697.9211538461539 3698.8630925760685 684.54375Q3687.8044387299146 671.1663461538461 3681.383284883761 652.9730769230769Q3674.962131037607 634.7798076923077 3675.3188618068375 611.2355769230769Q3675.6755925760685 592.685576923077 3680.848188729915 572.7086538461539Q3686.020784883761 552.7317307692308 3696.7227079606837 533.825Q3707.424631037607 514.9182692307693 3724.0126118068374 500.11394230769235Q3740.6005925760683 485.30961538461537 3763.7880925760683 476.39134615384614Q3786.9755925760683 467.4730769230769 3817.297707960684 467.82980769230767Q3839.0582848837607 468.1865384615384 3861.532323345299 474.0725961538461Q3884.0063618068375 479.9586538461538 3902.199631037607 491.73076923076917L3883.649631037607 529.1875Q3870.0938618068376 519.9125 3851.722227191453 514.5615384615385Q3833.3505925760683 509.2105769230769 3816.5842464222223 509.5673076923077Q3794.110207960684 509.5673076923077 3777.7005925760686 515.9884615384615Q3761.290977191453 522.4096153846153 3750.053957960684 533.1115384615384Q3738.8169387299145 543.8134615384615 3732.03905411453 556.8341346153845Q3725.2611694991456 569.8548076923076 3722.0505925760685 583.7673076923077Q3718.8400156529915 597.6798076923077 3718.483284883761 610.1653846153846Q3718.483284883761 628.3586538461539 3724.547707960684 641.7360576923077Q3730.612131037607 655.1134615384616 3740.6005925760683 664.566826923077Q3750.58905411453 674.0201923076924 3762.539534883761 679.7278846153847Q3774.4900156529916 685.435576923077 3786.6188618068377 688.2894230769231Q3798.747707960684 691.1432692307692 3808.3794387299145 691.5Q3818.7246310376067 691.8567307692308 3829.069823345299 690.2514423076923Q3839.4150156529913 688.6461538461539 3847.2630925760686 685.0788461538461L3852.61405411453 638.7038461538461H3803.7419387299146L3808.7361694991455 599.1067307692308H3899.7025156529917ZM4292.870661896295 728.6H4252.916815742449L4285.73604651168 459.625H4286.092777280911L4393.112008050141 642.9846153846154L4547.219700357834 459.625H4547.933161896295L4514.757200357833 728.6H4473.376431127064L4491.9264311270645 578.0596153846154L4384.907200357834 707.5528846153846H4384.193738819372L4310.350469588603 584.1240384615385ZM4717.762427325641 468.9H4890.063388864102L4885.4258888641025 507.42692307692306H4755.932619633333L4747.371081171795 578.7730769230769H4862.2383888641025L4857.244158094872 618.0134615384616H4742.376850402564L4733.815311941025 689.0028846153846H4868.3028119410255L4863.308581171795 728.6H4686.013388864102ZM5020.295538908831 728.6 5052.04457737037 468.9H5134.449385062677Q5170.122461985754 468.9 5193.8450581396 480.1370192307692Q5217.567654293446 491.3740384615385 5230.9450581395995 509.92403846153843Q5244.322461985754 528.4740384615384 5249.13832737037 551.8399038461538Q5253.954192754985 575.2057692307692 5251.45707737037 599.4634615384615Q5248.9599619857545 629.4288461538462 5237.009481216523 653.5081730769231Q5225.059000447292 677.5875 5205.973904293446 694.3538461538462Q5186.8888081396 711.1201923076924 5163.166211985754 719.8600961538461Q5139.443615831908 728.6 5113.402269678062 728.6ZM5066.670538908831 688.6461538461539H5111.618615831908Q5131.595538908831 688.6461538461539 5148.718615831908 682.7600961538462Q5165.841692754985 676.8740384615385 5178.862365831908 665.4586538461539Q5191.883038908831 654.0432692307693 5199.731115831908 636.7418269230769Q5207.579192754985 619.4403846153846 5209.362846601139 596.6096153846154Q5211.859961985754 571.9951923076923 5205.617173524215 555.2288461538461Q5199.374385062677 538.4625 5187.602269678062 528.1173076923077Q5175.830154293447 517.7721153846154 5161.204192754985 513.1346153846154Q5146.578231216523 508.49711538461537 5132.309000447292 508.49711538461537H5088.431115831908ZM5421.6430735689455 468.9H5464.450765876638L5432.701727415099 728.6H5389.894035107407ZM5617.1569543829055 728.6H5576.4896466905975L5724.532915921367 458.1980769230769H5727.030031305982L5808.721377459829 728.6H5760.919454382905L5744.153108229059 667.5990384615385H5649.619454382906ZM5734.521377459829 631.9259615384616 5712.404069767521 550.9480769230769 5668.882915921367 631.9259615384616Z';

  var CSS = [
    ':host{display:block;position:relative;aspect-ratio:4/3;overflow:hidden;cursor:pointer;container-type:inline-size;',
    'background:var(--hm-bg,transparent);color:var(--hm-ink,currentColor);-webkit-tap-highlight-color:transparent}',
    ':host(:focus-visible){outline:2px solid var(--hm-guide,#E8452C);outline-offset:3px}',
    'svg{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.ink{fill:var(--hm-ink,currentColor)}',
    '.red{stroke:var(--hm-guide,#E8452C);fill:none}',
    '.grey{stroke:var(--hm-measure,#6B7075);fill:none}',
    'text{font-family:var(--hm-font,ui-monospace,"SF Mono",Menlo,Consolas,monospace)}',
    'text.red{fill:var(--hm-guide,#E8452C);stroke:none}',
    'text.grey{fill:var(--hm-measure,#6B7075);stroke:none}',
    '.tint{fill:var(--hm-guide,#E8452C);fill-opacity:.14;stroke:none}',
    '.draw{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.1s cubic-bezier(.6,0,.2,1) var(--d,0s)}',
    '.on .draw{stroke-dashoffset:0}',
    '.fade{opacity:0;transition:opacity .6s ease var(--d,0s)}',
    '.on .fade{opacity:1}',
    '.cam{transition:transform 1.9s cubic-bezier(.65,0,.2,1)}',
    '.guides{transition:opacity .9s ease .4s}',
    'svg.v-mark[data-last] .guides{opacity:.4}',
    'svg.v-lock[data-last] .guides{opacity:0}',
    '.reset,.reset *{transition:none!important}',
    '.cap{position:absolute;left:4.5%;right:4.5%;bottom:4.5%;display:flex;flex-wrap:wrap;gap:.2em .9em;align-items:baseline;',
    'font-family:var(--hm-font,ui-monospace,"SF Mono",Menlo,Consolas,monospace);font-size:var(--hm-caption-size,11px);font-weight:400;line-height:var(--hm-caption-leading,1.9);',
    'letter-spacing:var(--hm-caption-tracking,0.8px);text-transform:uppercase;color:var(--hm-measure,#6B7075);pointer-events:none;transition:opacity .35s ease}',
    '.cap.out{opacity:0}',
    '.cap .n{color:var(--hm-guide,#E8452C)}',
    '.cap .t{text-transform:uppercase;color:var(--hm-ink,currentColor)}',
    ':host([captions="off"]) .cap{display:none}',
    '@media (prefers-reduced-motion:reduce){.draw,.fade,.cam,.guides,.cap{transition:none!important}}'
  ].join('');

  var VARIANTS = {
    /* ---------- mark ---------- */
    mark: {
      cls: 'v-mark', viewBox: '-520 -150 2180 1635', rest: 5, label: 'Construction of the Henning Media monogram',
      durations: [2500, 3200, 2600, 2600, 3800],
      steps: [
        ['One point', 'Every long edge runs to one vanishing point.'],
        ['Three scales', 'Back edges at 1, 1/φ and 1/φ³.'],
        ['The bar', 'h sectioned twice. The centre part, h/φ³, is the bar.'],
        ['The cuts', 'Gap, wedge, gap at 1 : φ : 1.'],
        ['The mark', 'H, M and a play triangle.']
      ],
      body:
        '<g data-s="5">' +
          '<path class="ink fade" style="--d:.1s" d="M105.2 1148.3 383.5 1018.6 455.7 678.7 610.6 678.7 555.4 938.4 727.4 858.3 837.8 338.9 700.0 258.5 644.8 518.2 489.8 518.2 562.1 178.1 339.0 48.1 Z"/>' +
          '<path class="ink fade" style="--d:.45s" d="M899.5 374.8 999.2 433.0 899.5 678.7 Z"/>' +
          '<path class="ink fade" style="--d:.8s" d="M1005.7 728.6 1284.0 599.0 1060.9 468.9 Z"/>' +
        '</g>' +
        '<g class="guides">' +
          '<g data-s="1">' +
            '<circle class="fade" cx="1284" cy="599" r="11" fill="var(--hm-guide,#E8452C)"/>' +
            '<line class="red draw" pathLength="1" stroke-width="1.5" style="--d:.3s" x1="1400" y1="599" x2="-140" y2="599"/>' +
            '<line class="red draw" pathLength="1" stroke-width="2.5" style="--d:.5s" x1="1284" y1="599" x2="20" y2="-137.9"/>' +
            '<line class="red draw" pathLength="1" stroke-width="2.5" style="--d:.5s" x1="1284" y1="599" x2="20" y2="1188"/>' +
          '</g>' +
          '<g data-s="2">' +
            '<line class="red draw" pathLength="1" stroke-width="1.2" x1="348" y1="-8" x2="96" y2="1180"/>' +
            '<line class="red draw" pathLength="1" stroke-width="1.2" style="--d:.25s" x1="732.4" y1="106" x2="508.9" y2="1160"/>' +
            '<line class="red draw" pathLength="1" stroke-width="1.2" style="--d:.5s" x1="1123" y1="177" x2="947.5" y2="1003"/>' +
            '<line class="red draw" pathLength="1" stroke-width="5" style="--d:.3s" x1="339" y1="48.1" x2="105.2" y2="1148.3"/>' +
            '<line class="red draw" pathLength="1" stroke-width="5" style="--d:.55s" x1="700" y1="258.5" x2="555.4" y2="938.5"/>' +
            '<line class="red draw" pathLength="1" stroke-width="5" style="--d:.8s" x1="1060.9" y1="468.9" x2="1005.7" y2="728.6"/>' +
            '<g class="fade" style="--d:.9s" font-size="28">' +
              '<text class="red" x="364" y="14">1</text><text class="red" x="746" y="128">1/φ</text><text class="red" x="1136" y="200">1/φ³</text>' +
            '</g>' +
            '<g class="fade grey" style="--d:1.2s" stroke-width="1">' +
              '<path d="M222 599V1244M472.7 599V1244M627.6 599V1244M782.6 599V1244M1033.3 599V1244M1284 599V1244" stroke-dasharray="3 7"/>' +
              '<path stroke-width="2" d="M222 1230H1284M222 1216V1244M472.7 1216V1244M627.6 1216V1244M782.6 1216V1244M1033.3 1216V1244M1284 1216V1244"/>' +
              '<g text-anchor="middle" font-size="28">' +
                '<text class="grey" x="347.4" y="1284">φ·m</text><text class="grey" x="550.2" y="1284">m</text><text class="grey" x="705.1" y="1284">m</text>' +
                '<text class="grey" x="908" y="1284">φ·m</text><text class="grey" x="1158.7" y="1284">φ·m</text>' +
              '</g>' +
            '</g>' +
          '</g>' +
          '<g data-s="3">' +
            '<g class="grey" stroke-width="1" stroke-dasharray="3 7">' +
              '<line class="fade" x1="-60" y1="258.5" x2="700" y2="258.5"/><line class="fade" x1="-60" y1="518.3" x2="644.8" y2="518.3"/>' +
              '<line class="fade" x1="-60" y1="678.8" x2="610.6" y2="678.8"/><line class="fade" x1="-60" y1="938.5" x2="555.4" y2="938.5"/>' +
            '</g>' +
            '<path class="grey fade" stroke-width="2" style="--d:.2s" d="M-60 258.5V938.5M-74 258.5H-46M-74 518.3H-46M-74 678.8H-46M-74 938.5H-46"/>' +
            '<g class="fade" style="--d:.4s" text-anchor="end" font-size="28">' +
              '<text class="grey" x="-86" y="398">h/φ²</text><text class="grey" x="-86" y="608">h/φ³</text><text class="grey" x="-86" y="818">h/φ²</text>' +
            '</g>' +
            '<polygon class="red draw" pathLength="1" stroke-width="4" style="--d:.6s" points="455.7,678.7 610.6,678.7 644.8,518.2 489.8,518.2"/>' +
          '</g>' +
          '<g data-s="4">' +
            '<g class="grey fade" stroke-width="1">' +
              '<path stroke-dasharray="3 7" d="M837.9 338.9V276M899.5 374.8V276M999.2 433V276M1060.9 468.9V276"/>' +
              '<path stroke-width="2" d="M837.9 290H1060.9M837.9 276V304M899.5 276V304M999.2 276V304M1060.9 276V304"/>' +
            '</g>' +
            '<g class="fade" style="--d:.2s" text-anchor="middle" font-size="28">' +
              '<text class="grey" x="868.7" y="262">1</text><text class="grey" x="949.4" y="262">φ</text><text class="grey" x="1030" y="262">1</text>' +
            '</g>' +
            '<polygon class="red draw" pathLength="1" stroke-width="4" style="--d:.4s" points="899.5,374.8 999.2,433 899.5,678.7"/>' +
            '<line class="red draw" pathLength="1" stroke-width="1.5" style="--d:.9s" x1="610.6" y1="678.7" x2="930" y2="678.7"/>' +
          '</g>' +
        '</g>'
    },

    /* ---------- horizontal lockup ---------- */
    horizontal: {
      cls: 'v-lock', viewBox: '-243 -1801 6400 4800', rest: 4, label: 'Construction of the Henning Media horizontal lockup',
      centre: [2957, 599],
      cams: [[1500, 599, 2.3], [1500, 599, 2.3], [1500, 599, 2.3], [1500, 599, 2.3], null, null],
      durations: [2600, 2800, 2600, 3200, 3800],
      steps: [
        ['The unit', 'T is the back edge of the play triangle.'],
        ['The gap', 'One T from mark to wordmark.'],
        ['Cap height', 'Also T. Tracking is cap ÷ φ².'],
        ['Full lockup', 'The wordmark sits on the triangle.'],
        ['Horizontal lockup', '']
      ],
      body:
        '<g data-s="1"><path class="ink fade" d="' + '%MARK%' + '"/></g>' +
        '<g data-s="3"><path class="ink fade" style="--d:.2s" d="' + '%WORD%' + '"/></g>' +
        '<g class="guides">' +
          '<g data-s="1">' +
            '<line class="red draw" pathLength="1" stroke-width="14" style="--d:.6s" x1="1060.9" y1="468.9" x2="1005.7" y2="728.6"/>' +
            '<text class="red fade" style="--d:1.2s" x="982" y="624" text-anchor="end" font-size="70">T</text>' +
          '</g>' +
          '<g data-s="2">' +
            '<line class="red draw" pathLength="1" stroke-width="6" x1="1005" y1="468.9" x2="5860" y2="468.9"/>' +
            '<line class="red draw" pathLength="1" stroke-width="6" x1="1005" y1="728.6" x2="5860" y2="728.6"/>' +
            '<rect class="tint fade" style="--d:.7s" x="1284" y="468.9" width="259.7" height="259.7"/>' +
            '<rect class="red draw" pathLength="1" stroke-width="6" style="--d:.5s" x="1284" y="468.9" width="259.7" height="259.7"/>' +
            '<text class="red fade" style="--d:1.1s" x="1413.85" y="624" text-anchor="middle" font-size="70">T</text>' +
          '</g>' +
        '</g>'
    },

    /* ---------- stacked lockup ---------- */
    stacked: {
      cls: 'v-lock', viewBox: '-1905 -1012 5200 3900', rest: 4, label: 'Construction of the Henning Media stacked lockup',
      centre: [695, 938],
      cams: [[694.6, 620, 2.2], [694.6, 620, 2.2], null, null, null, null],
      durations: [2600, 3000, 2800, 3000, 3800],
      steps: [
        ['The unit', 'h is the back edge of the middle triangle.'],
        ['The axis', 'Centre of the mark’s width.'],
        ['The gap', 'h/φ below the mark.'],
        ['The wordmark', 'Cap height T, centred on the axis.'],
        ['Stacked lockup', '']
      ],
      body:
        '<g data-s="1"><path class="ink fade" d="' + '%MARK%' + '"/></g>' +
        '<g data-s="4"><g transform="translate(-2983.7511 1099.6631)"><path class="ink fade" style="--d:.5s" d="' + '%WORD%' + '"/></g></g>' +
        '<g class="guides">' +
          '<g data-s="1">' +
            '<line class="red draw" pathLength="1" stroke-width="12" style="--d:.6s" x1="700" y1="258.5" x2="555.4" y2="938.5"/>' +
            '<text class="red fade" style="--d:1.2s" x="716" y="226" text-anchor="middle" font-size="72">h</text>' +
          '</g>' +
          '<g data-s="2">' +
            '<line class="red draw" pathLength="1" stroke-width="7" stroke-dasharray="none" style="--d:.3s" x1="694.6" y1="-60" x2="694.6" y2="1930"/>' +
          '</g>' +
          '<g data-s="3">' +
            '<line class="red draw" pathLength="1" stroke-width="7" x1="2960" y1="1148.3" x2="-1440" y2="1148.3"/>' +
            '<line class="red draw" pathLength="1" stroke-width="7" style="--d:.3s" x1="2960" y1="1568.56" x2="-1440" y2="1568.56"/>' +
            '<path class="red fade" stroke-width="7" style="--d:.9s" d="M2920 1148.3V1568.56"/>' +
            '<text class="red fade" style="--d:1.1s" x="2990" y="1394" font-size="110">h/φ</text>' +
          '</g>' +
          '<g data-s="4">' +
            '<line class="red draw" pathLength="1" stroke-width="7" x1="2960" y1="1828.26" x2="-1440" y2="1828.26"/>' +
            '<path class="red fade" stroke-width="7" style="--d:.7s" d="M2920 1568.56V1828.26"/>' +
            '<text class="red fade" style="--d:.9s" x="2990" y="1736" font-size="110">T</text>' +
          '</g>' +
        '</g>'
    }
  };

  class HM extends HTMLElement {}

  HM.prototype.connectedCallback = function () {
    var self = this;
    if (!this._built) {
      this._built = true;
      var v = this._v = VARIANTS[this.getAttribute('variant')] || VARIANTS.mark;
      this._total = v.steps.length;
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>' + CSS + '</style>' +
        '<svg class="' + v.cls + '" viewBox="' + v.viewBox + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + v.label + '">' +
        '<g class="cam">' + v.body.split('%MARK%').join(MARK).split('%WORD%').join(WORD) + '</g></svg>' +
        '<div class="cap" aria-hidden="true"><span class="n"></span><span class="t"></span><span class="c"></span></div>';
      this._svg = root.querySelector('svg');
      this._cam = root.querySelector('.cam');
      this._groups = root.querySelectorAll('[data-s]');
      this._cap = root.querySelector('.cap');
      if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
      this.addEventListener('click', function () { self.play(); });
      this.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.play(); }
      });
      this._instant(v.rest);
    }
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still && this.getAttribute('autoplay') !== 'off' && 'IntersectionObserver' in window) {
      this._io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { if (!self._played) { self._played = true; self.play(); } }
          else if (self.hasAttribute('loop')) { self.stop(); self._played = false; self._instant(self._v.rest); }
        });
      }, { threshold: 0.5 });
      this._io.observe(this);
    }
  };

  HM.prototype.disconnectedCallback = function () {
    this.stop();
    if (this._io) { this._io.disconnect(); this._io = null; }
  };

  HM.prototype._instant = function (n) {
    this._svg.classList.add('reset');
    this.goTo(n);
    this._svg.getBoundingClientRect();
    this._svg.classList.remove('reset');
  };

  HM.prototype.goTo = function (n) {
    var v = this._v, i, g, cam, cap = this._cap, s;
    n = Math.max(0, Math.min(this._total, n | 0));
    this._step = n;
    this._svg.setAttribute('data-step', n);
    if (n === this._total) this._svg.setAttribute('data-last', ''); else this._svg.removeAttribute('data-last');
    for (i = 0; i < this._groups.length; i++) {
      g = this._groups[i];
      g.classList.toggle('on', +g.getAttribute('data-s') <= n);
    }
    if (v.cams) {
      cam = v.cams[n];
      this._cam.style.transform = cam
        ? 'translate(' + v.centre[0] + 'px,' + v.centre[1] + 'px) scale(' + cam[2] + ') translate(' + (-cam[0]) + 'px,' + (-cam[1]) + 'px)'
        : 'none';
    }
    s = n > 0 ? v.steps[n - 1] : null;
    cap.classList.toggle('out', !s);
    if (s) {
      cap.children[0].textContent = (n < 10 ? '0' : '') + n;
      cap.children[1].textContent = s[0];
      cap.children[2].textContent = s[1];
    }
    this.dispatchEvent(new CustomEvent('hm-step', { detail: { step: n, total: this._total } }));
  };

  HM.prototype.stop = function () { clearTimeout(this._timer); this._timer = null; };

  HM.prototype.play = function () {
    var self = this, v = this._v, n = 0;
    this.stop();
    this._instant(0);
    (function next() {
      n++;
      self.goTo(n);
      if (n < self._total) self._timer = setTimeout(next, v.durations[n - 1]);
      else if (self.hasAttribute('loop')) self._timer = setTimeout(function () { self.play(); }, v.durations[n - 1]);
    })();
  };

  customElements.define('hm-construction', HM);
})();

export {};
