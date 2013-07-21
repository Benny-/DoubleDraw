
Ext.define('DD.view.Palettes' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.palettes',
    
    title: 'Palettes',
    layout: {
        type: 'vbox',
        align: 'stretch',
        defaultMargins : '5'
    },
    
    initComponent: function() {
        
        this.tbar = [
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
        this.callParent(arguments);
        
        Ext.getStore('Palettes').data.each(function(palette, index, length) {
            this.add(
                Ext.create(
                    'DD.view.Palette',
                    {
                        palette:palette,
                        layout: 'fit',
                    }
                )
            );
        }, this);
        
        // this.add(Ext.create("Ext.Button", {title:"First"} ));
        // this.add(Ext.create("Ext.Button", {title:"Second"} ));
    }
});
