Ext.application({
    name: 'DD', // DoubleDraw
    controllers: [
        'Canvas'
    ],
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items:
            {
                    layout: "border",
                    bodyBorder: false,
                    defaults: {
                        collapsible: true,
                        split: true,
                        bodyPadding: 5
                    },
                    tbar: {
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype: 'button',
                                text: 'save image or sumthing'
                            },
                            {
                                xtype: 'button',
                                text: '?'
                            },
                        ]
                    },
                    items: [
                        {
                            xtype: 'tabpanel',
                            title: 'Sun',
                            region:'west',
                            floatable: false,
                            width: 180,
                            minWidth: 60,
                            minHeight: 50,
                            plain: true,
                            defaults: {
                                collapsible: false,
                                bodyPadding: 10,
                                autoScroll: true
                            },
                            activeItem: 0,
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    title: 'Brushes',
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: 'button 1'
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'button 2'
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'button 2'
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'button 2'
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'button 2'
                                        },
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    title: 'Brushes',
                                    html: 'more Brushes'
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    title: 'colors',
                                    html: 'B-bbakka!'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            id: 'canvasPanel',
                            collapsible: false,
                            region: 'center',
                            minWidth: 50,
                            minHeight: 50,
                            html : '<canvas id="html5_canvas" width="256" height="256"><p>Canvas is not supported in your browser.</p></canvas>',
                        },
                        {
                            xtype: 'tabpanel',
                            title: 'Moon',
                            region:'east',
                            floatable: false,
                            width: 180,
                            minWidth: 60,
                            minHeight: 50,
                            plain: true,
                            defaults: {
                                collapsible: false,
                                bodyPadding: 10,
                                autoScroll: true
                            },
                            activeItem: 0,
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    title: 'Brushes',
                                    html: 'Brushes'
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    title: 'Brushes',
                                    html: 'more Brushes'
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    title: 'colors',
                                    html: 'B-bbakka!'
                                }
                            ]
                        }
                    ],
                    
                    bbar: {
                        // statusbar
                    }
            }
        });
        
        var socket = io.connect('http://doubledraw.klasma.c9.io/');
        socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', { my: 'data' });
        });
        
        Ext.override(Ext.Panel, {
            makeDockable: function() {
        		var o = this.ownerCt;
        		if (!o || !(o instanceof Ext.TabPanel)) {
        			return;
        		}
        		Ext.fly(o.getTabEl(this)).on("dblclick", this.undock, this);
        	},
        	
        	undock: function() {
        		var h = this.getEl().getHeight();
        		var w = this.getEl().getWidth();
        		var o = this.ownerCt;
        		o.remove(this);
        		var win;
        		win = new Ext.Window({
        			renderTo: Ext.getBody(),
        			title: this.title,
        			constrain: true,
        			items: this,
        			tools: [{
        				id: 'pin',
        				qtip: 'Redock to original parent',
        				handler: function() {
        					win.remove(this);
        					o.add(this);
        					o.setActiveTab(this);
        					o.doLayout();
        					win.destroy();
        					this.makeDockable(); // The tab selector is new.
        				},
        				scope: this
        			}]
        		});
        		win.setHeight(h);
        		win.setWidth(w);
        		o.doLayout();
        		win.show();
        	}
        });
        
    }
});
