
Ext.define('DD.view.Palettes' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.palettes',
    
    layout: {
        type: 'vbox',
        align: 'stretch',
        defaultMargins : '3'
    },
    bodyPadding: 3,
    
    config: {
        store: 'Palettes',
        paletteViewTools: [],
        editable: false,
    },
    
    addPaletteView: function(palette) {
        this.add(
            Ext.create(
                'DD.view.Palette',
                {
                    palette: palette,
                    tools: this.paletteViewTools,
                    layout: 'fit',
                    editable: this.editable,
                }
            )
        );
    },
    
    createPaletteViews: function () {
        this.removeAll(true);
        
        Ext.getStore(this.store).data.each(function(palette, index, length) {
            this.addPaletteView(palette);
        }, this);
    },
    
    constructor: function( config ) {
        this.callParent( arguments );
        this.initConfig( config );
    },
    
    initComponent: function() {
        this.callParent(arguments);
        
        Ext.getStore(this.store).on("add", function(store, records, index, eOpts) {
            records.forEach(function(palette) {
                this.addPaletteView(palette);
            }, this);
        }, this);
        
        Ext.getStore(this.store).on("bulkremove", function(store, record, index, isMove, eOpts) {
            this.createPaletteViews();
        }, this);
        
        this.createPaletteViews();
    }
});
