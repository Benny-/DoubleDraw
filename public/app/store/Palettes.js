
Ext.define('DD.store.Palettes', {
    extend: 'Ext.data.Store',
    model: 'DD.model.Palette',
    
    constructor: function () {
        this.callParent(arguments);
        
        var color, palette;
        
        palette = Ext.create('DD.model.Palette', {name:'New palette'} );
        color = Ext.create('DD.model.Color', {name:'Untitiled color 1 '} );
        palette.colors().add(color);
        this.add(palette);
        
        palette = Ext.create('DD.model.Palette', {name:'Second palette'} );
        color = Ext.create('DD.model.Color', {name:'Untitiled color 2'} );
        palette.colors().add(color);
        color = Ext.create('DD.model.Color', {name:'Untitiled color 3'} );
        palette.colors().add(color);
        color = Ext.create('DD.model.Color', {name:'Untitiled color 4'} );
        palette.colors().add(color);
        color = Ext.create('DD.model.Color', {name:'Untitiled color 5'} );
        palette.colors().add(color);
        color = Ext.create('DD.model.Color', {name:'Untitiled color 6'} );
        palette.colors().add(color);
        this.add(palette);
        
    },
    
});
