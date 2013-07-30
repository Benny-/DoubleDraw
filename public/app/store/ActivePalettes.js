
Ext.define('DD.store.ActivePalettes', {
    extend: 'Ext.data.Store',
    model: 'DD.model.Palette',
    
    autoSync: true,
    // autoLoad: true, // autoLoad does not seem to work. W'll call this.load() in the constructor.
    
    proxy: {
        type: 'localstorage',
        id  : 'active-palettes'
    },
    
    constructor: function () {
        this.callParent(arguments);
        this.load();
    },
    
    /*
    load(), sync(), save() all do not seem to work as expected for some reason.
    I dont know why.
    Below is a alternative implementation.
    */
    
    load: function() {
        this.callParent(arguments);
        
        var ids = this.getProxy().getStorageObject().getItem(this.getProxy().id).split(',')
        
        ids.forEach(function(id) {
            id = parseInt(id);
            if(id)
            {
                var palette = Ext.getStore('Palettes').getById(parseInt(id));
                this.add(palette);
            }

        }, this);
    },
    
    sync: function() {
        this.callParent(arguments);
        
        var ids = [];
        this.each(function(palette) {
            ids.push(palette.get("id"));
        });
        
        this.getProxy().getStorageObject().setItem(this.getProxy().id, "" + ids.join(','));
    },
    
});
