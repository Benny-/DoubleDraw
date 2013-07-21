
Ext.define('DD.model.Palette', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'name', type: 'string'},
    ],
    hasMany : {
        name: 'colors',
        model: 'DD.model.Color',
    },
    
    constructor: function () {
        this.callParent(arguments);
    },
    
});
