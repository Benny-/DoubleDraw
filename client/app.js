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
                        bodyPadding: 15
                    },
                    tbar: new Ext.Toolbar({ 
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
                    }),
                    items: [
                        {
                            xtype: 'panel',
                            title: 'Left controls',
                            region:'west',
                            floatable: false,
                            margins: '5 0 0 0',
                            minWidth: 50,
                            minHeight: 50,
                            items: [
                                {
                                    xtype: 'button',
                                    //icon: 'resources/images/tools/unknown.svg',
                                    text: 'Tool 1'
                                },
                                {
                                    xtype: 'button',
                                    //icon: 'resources/images/tools/unknown.png',
                                    text: 'Tool 2'
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            id: 'canvasPanel',
                            collapsible: false,
                            region: 'center',
                            margins: '5 0 0 0',
                            minWidth: 50,
                            minHeight: 50,
                            html : '<canvas id="html5_canvas" width="256" height="256"><p>Canvas is not supported in your browser.</p></canvas>',
                        },
                        {
                            xtype: 'panel',
                            title: 'Right controls',
                            html : 'hi',
                            region:'east',
                            floatable: false,
                            margins: '5 0 0 0',
                            minWidth: 50,
                            minHeight: 50,
                        }
                    ]
            }
        });
        
        var socket = io.connect('http://doubledraw.klasma.c9.io/');
        socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', { my: 'data' });
        });
        
    }
});
