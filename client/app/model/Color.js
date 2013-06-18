
Ext.define('DD.model.Color', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'Name', type: 'string'},
        {name: 'r', type: 'int'},
        {name: 'g', type: 'int'},
        {name: 'b', type: 'int'},
        {name: 'a', type: 'float'},
    ],
    belongsTo : 
    {
        name:'palette',
        model:'DD.model.Palette',
    },
});
