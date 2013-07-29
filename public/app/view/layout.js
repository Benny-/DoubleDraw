
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
                                id: 'allPalettes',
                                xtype: 'palettes',
                                title: 'Palettes',
                                editable: true,
                                paletteViewTools:[
                                    {
                                        type:'pin',
                                        tooltip: 'Pin palette to colors panel',
                                    },
                                    {
                                        type:'plus',
                                        tooltip: 'Add a new color',
                                    },
                                    {
                                        type:'close',
                                        tooltip: 'Delete this palette',
                                    },
                                ],
                                tbar: [
                                    {
                                        text: 'Add',
                                        tooltip: 'Add a new empty pallete',
                                        id: 'add_palette'
                                    }, 
                                    {
                                        text: 'Import',
                                        tooltip: 'Import a existing pallete',
                                        id: 'import_palette'
                                    },
                                    {
                                        text: 'Reset',
                                        tooltip: 'Destroy all palletes',
                                        id: 'reset_palettes'
                                    }
                                ],
                            },
                            {
                                xtype: 'fieldcontainer',
                                title: 'Chat',
                            },
                        ]
                    },
                    {
                        id: 'canvasPanel',
                        xtype: 'canvas',
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
                            autoScroll: true
                        },
                        activeItem: 0,
                        items: [
                            {
                                xtype: 'users',
                                title: 'Users',
                            },
                            {
                                // This view might be confusing. It contains a subset of Palettes.
                                // To the users it will be shown as the "Colors" panel. However,
                                // in the code we will refer to this panel as "activePalettes"
                                id: 'activePalettes',
                                xtype: 'palettes',
                                title: 'Colors',
                                store: 'ActivePalettes',
                                paletteViewTools:[
                                    {
                                        type:'unpin',
                                        tooltip: 'Unpin palette from the colors panel',
                                    },
                                ],
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
                            id: 'colorSelectionPrimary',
                            xtype: 'colorbox',
                        },
                        {
                            id: 'colorSelectionSecondary',
                            xtype: 'colorbox',
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