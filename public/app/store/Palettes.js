
Ext.define('DD.store.Palettes', {
    extend: 'Ext.data.Store',
    model: 'DD.model.Palette',
    
    autoSync: true,
    // autoLoad: true, // autoLoad does not seem to work. W'll call this.load() in the constructor.
    
    constructor: function () {
        this.callParent(arguments);
        this.load();
    },
    
});
