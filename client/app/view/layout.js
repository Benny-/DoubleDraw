
createLayout = function()
{
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
                            text: 'File',                      
                            menu: {
                                xtype: 'menu',                          
                                items: [
                                    {
                                        text: 'Save',
                                    },
                                    '-',
                                    {
                                        text: 'Exit',
                                    },
                                ]                          
                            }
                        },
                        {
                            text: 'Help',                      
                            menu: {
                                xtype: 'menu',                          
                                items: [
                                    {
                                        text: 'Manual',
                                    },
                                    '-',
                                    {
                                        text: 'About',
                                    },
                                ]                          
                            }
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
                                xtype: 'tools',
                                title: 'Tools',
                            },
                            {
                                xtype: 'fieldcontainer',
                                title: 'Palettes',
                            },
                            {
                                xtype: 'fieldcontainer',
                                title: 'Chat',
                            },
                        ]
                    },
                    {
                        xtype: 'canvas',
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
                                title: 'Users',
                            },
                            {
                                xtype: 'fieldcontainer',
                                title: 'Colours',
                            },
                            {
                                xtype: 'fieldcontainer',
                                title: 'Layers',
                            },
                        ]
                    }
                ],
                
                bbar: {
                    items: [
                        'pos values',
                        '-',
                        'colour values',
                        '-',
                        'Connection state',
                    ]
                }
        }
    });
}