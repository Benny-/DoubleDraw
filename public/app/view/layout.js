
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
                            xtype: 'button',
                            menu: {
                                xtype: 'menu',
                                items: [
                                    {
                                        xtype: 'menuitem',
                                        text: 'Save as .paperjs.json',
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
                            xtype: 'button',
                            menu: {
                                xtype: 'menu',
                                items: [
                                    {
                                        text: 'Manual',
                                        disabled: true,
                                    },
                                    '-',
                                    {
                                        text: 'About',
                                        disabled: true,
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
                                store: 'Palettes',
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
                                        disabled: true,
                                        tooltip: 'Import a existing pallete',
                                        id: 'import_palette'
                                    },
                                    {
                                        text: 'Reset',
                                        disabled: true,
                                        tooltip: 'Destroy all palletes',
                                        id: 'reset_palettes'
                                    }
                                ],
                            },
                            {
                                xtype: 'chat',
                                id: 'main_chat',
                                bbar: [
                                    {
                                        xtype: 'textfield',
                                        width: '100%',
                                        name: 'chat',
                                        fieldLabel: 'Chat',
                                        hideLabel: 'true',
                                        emptyText: 'Type here to chat',
                                    },
                                ],
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
                        html : '<canvas id="html5_canvas" width="0" height="0" oncontextmenu="return false;"><p>This program is not supported in your browser.</p></canvas>',
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
                                id: 'layers',
                                xtype: 'layers',
                                title: 'Layers',
                                tbar: [
                                    {
                                        text: 'Refresh',
                                        tooltip: 'This program can not update the tree on its own yet. Hit this button to update the tree',
                                        id: 'refreshLayers'
                                    },
                                    {
                                        text: 'Add',
                                        disabled: false,
                                        tooltip: 'Append a new layer',
                                        id: 'appendLayer'
                                    },
                                ],
                            },
                        ]
                    }
                ],
                
                bbar: {
                    id: 'statusBar',
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
                        {
                            id: 'connectionStatus',
                            xtype: 'tbtext',
                            text: 'Connecting...',
                        },
                    ]
                }
        }
    });
}
