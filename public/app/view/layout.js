
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
                                        xtype: 'menuitem',  
                                        text: 'Save all locally',
                                        id: 'file_menu_save',
                                    },
                                    '-',
                                    {
                                        xtype: 'menuitem',  
                                        text: 'Export all as SVG',
                                        id: 'file_menu_export_svg',
                                    },
                                    {
                                        xtype: 'menuitem',  
                                        text: 'Export view as PNG',
                                        id: 'file_menu_export_png',
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
                            autoScroll: true
                        },
                        activeItem: 0,
                        items: [
                            {
                                xtype: 'tools',
                            },
                            {
                                xtype: 'palettes',
                                bodyPadding: 7,
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
                        bodyPadding: 5,
                        minHeight: 50,
                        html : '<canvas id="html5_canvas" width="0" height="0"><p>This program not supported in your browser.</p></canvas>',
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
                                xtype: 'users',
                                title: 'Users',
                            },
                            {
                                xtype: 'colors',
                                bodyPadding: 7,
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
                        {
                            xtype: 'colorbox',
                            id: 'colorSelectionPrimary',
                        },
                        {
                            xtype: 'colorbox',
                            id: 'colorSelectionSecondary',
                        },
                        '-',
                        'colour values',
                        '-',
                        'position values',
                        '-',
                        'Connection state',
                    ]
                }
        }
    });
}