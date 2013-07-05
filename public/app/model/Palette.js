
Ext.define('DD.model.Palette', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'Name', type: 'string'},
    ],
    hasMany : {
        name: 'colors',
        model: 'DD.model.Color',
    } 
});
