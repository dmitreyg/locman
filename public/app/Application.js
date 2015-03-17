// enable javascript cache for debugging, otherwise Chrome breakpoints are lost
Ext.Loader.setConfig({ disableCaching: false });

Ext.require([
    'Ext.direct.*',
    'Ext.data.*'
]);

Ext.onReady(function () {
    Ext.direct.Manager.addProvider(ExtRemote.REMOTING_API);
});

Ext.define('LocmanUi.Application', {
    name: 'LocmanUi',

    extend: 'Ext.app.Application',

    views: [
        'Main', 'NavigationGrid'
    ],

    controllers: [
        'MainController'
    ],

    stores: [
        'NavigationData'
    ],

    refs: [
        { ref: 'logoPanel', selector: '#logoPanel' }
    ],
    
    init: function () {
        //console.log('init');
        Ext.direct.Manager.addProvider(ExtRemote.REMOTING_API);
    },

    flags: ['ad.png', 'ae.png', 'af.png', 'ag.png', 'ai.png', 'al.png', 'am.png', 'an.png', 'ao.png', 'ar.png', 'as.png', 'at.png', 'au.png', 'aw.png', 'ax.png', 'az.png', 'ba.png', 'bb.png', 'bd.png', 'be.png', 'bf.png', 'bg.png', 'bh.png', 'bi.png', 'bj.png', 'bm.png', 'bn.png', 'bo.png', 'br.png', 'bs.png', 'bt.png', 'bv.png', 'bw.png', 'by.png', 'bz.png', 'ca.png', 'cc.png', 'cd.png', 'cf.png', 'cg.png', 'ch.png', 'ci.png', 'ck.png', 'cl.png', 'cm.png', 'cn.png', 'co.png', 'cr.png', 'cs.png', 'cu.png', 'cv.png', 'cx.png', 'cy.png', 'cz.png', 'de.png', 'dj.png', 'dk.png', 'dm.png', 'do.png', 'dz.png', 'ec.png', 'ee.png', 'eg.png', 'eh.png', 'er.png', 'es.png', 'et.png', 'fi.png', 'fj.png', 'fk.png', 'fm.png', 'fo.png', 'fr.png', 'ga.png', 'gb.png', 'gd.png', 'ge.png', 'gf.png', 'gh.png', 'gi.png', 'gl.png', 'gm.png', 'gn.png', 'gp.png', 'gq.png', 'gr.png', 'gs.png', 'gt.png', 'gu.png', 'gw.png', 'gy.png', 'hk.png', 'hm.png', 'hn.png', 'hr.png', 'ht.png', 'hu.png', 'id.png', 'ie.png', 'il.png', 'in.png', 'io.png', 'iq.png', 'ir.png', 'is.png', 'it.png', 'jm.png', 'jo.png', 'jp.png', 'ke.png', 'kg.png', 'kh.png', 'ki.png', 'km.png', 'kn.png', 'kp.png', 'kr.png', 'kw.png', 'ky.png', 'kz.png', 'la.png', 'lb.png', 'lc.png', 'li.png', 'lk.png', 'lr.png', 'ls.png', 'lt.png', 'lu.png', 'lv.png', 'ly.png', 'ma.png', 'mc.png', 'md.png', 'me.png', 'mg.png', 'mh.png', 'mk.png', 'ml.png', 'mm.png', 'mn.png', 'mo.png', 'mp.png', 'mq.png', 'mr.png', 'ms.png', 'mt.png', 'mu.png', 'mv.png', 'mw.png', 'mx.png', 'my.png', 'mz.png', 'na.png', 'nc.png', 'ne.png', 'nf.png', 'ng.png', 'ni.png', 'nl.png', 'no.png', 'np.png', 'nr.png', 'nu.png', 'nz.png', 'om.png', 'pa.png', 'pe.png', 'pf.png', 'pg.png', 'ph.png', 'pk.png', 'pl.png', 'pm.png', 'pn.png', 'pr.png', 'ps.png', 'pt.png', 'pw.png', 'py.png', 'qa.png', 're.png', 'ro.png', 'rs.png', 'ru.png', 'rw.png', 'sa.png', 'sb.png', 'sc.png', 'sd.png', 'se.png', 'sg.png', 'sh.png', 'si.png', 'sj.png', 'sk.png', 'sl.png', 'sm.png', 'sn.png', 'so.png', 'sr.png', 'st.png', 'sv.png', 'sy.png', 'sz.png', 'tc.png', 'td.png', 'tf.png', 'tg.png', 'th.png', 'tj.png', 'tk.png', 'tl.png', 'tm.png', 'tn.png', 'to.png', 'tr.png', 'tt.png', 'tv.png', 'tw.png', 'tz.png', 'ua.png', 'ug.png', 'um.png', 'us.png', 'uy.png', 'uz.png', 'va.png', 'vc.png', 've.png', 'vg.png', 'vi.png', 'vn.png', 'vu.png', 'wf.png', 'ws.png', 'ye.png', 'yt.png', 'za.png', 'zm.png', 'zw.png' ],

    getRandomImage: function (minX, maxX, minY, maxY) {
        var flag = this.flags[this.getRandomInt(0,240)];
        var x = this.getRandomInt(minX,maxX);
        var y = this.getRandomInt(minY,maxY);
        var randomImage = Ext.create('Ext.Img', {
            src: '../resources/icons/flags/' + flag,
            x: x,
            y: y
        });
        return randomImage;
    },

    getPositionedImage: function (x, y) {
        var flag = this.flags[this.getRandomInt(0,240)];
        var randomImage = Ext.create('Ext.Img', {
            src: '../resources/icons/flags/' + flag,
            x: x,
            y: y
        });
        return randomImage;
    },

    getRandomInt: function  (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    launch: function () {
        //console.log('application launch'); // this works fine

//        this.getLogoPanel().add(Ext.create('Ext.Img', {
//            src: '../resources/images/locman2.png',
//            x: 15,
//            y: 35
//        }));

//        this.getLogoPanel().doLayout();
//
//        var x = 15;
//        while (x < 500) {
//            var image = this.getPositionedImage(x, 20);
//            this.getLogoPanel().add(image);
//            x = x + 30;
//        }
//
//        x = 15;
//        while (x < 500) {
//            var image = this.getPositionedImage(x, 45);
//            this.getLogoPanel().add(image);
//            x = x + 30;
//        }
//
//        x = 15;
//        while (x < 500) {
//            var image = this.getPositionedImage(x, 70);
//            this.getLogoPanel().add(image);
//            x = x + 30;
//        }
//
//        this.getLogoPanel().doLayout();
    }
});
