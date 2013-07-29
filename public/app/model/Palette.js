
Ext.require([    
    'DD.model.Color',
]);

Ext.define('DD.model.Palette', {
    extend: 'Ext.data.Model',
    
    fields: [
        {name: 'id',   type: 'int'},
        {name: 'name', type: 'string'},
    ],
    
    hasMany : {
        name: 'colors',
        model: 'DD.model.Color',
    },
    
    proxy: {
        type: 'localstorage',
        id  : 'all-palettes'
    },
    
    constructor: function () {
        this.callParent(arguments);
        
        // extjs does not seem able to store relations in localstorage. This is a workaround so the relations are still intact.
        var allColors = Ext.create('Ext.data.Store', {model:'DD.model.Color'});
        allColors.load();
        allColors.each(function(color){
            if(color.get("palette_id") == this.get("id"))
                this.colors().add(color);
        }, this);
    },
    
});
