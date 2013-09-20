Ext.define('DD.model.PaperItem', {
    extend: 'Ext.data.Model',
    
    config: {
    	item: null,
    },
    
    fields: [
        {name: 'type', type: 'string', 
            convert: function(v, rec) { 
                return rec.item ? rec.item.type : "Unknown"; 
            }
        },
    ],
    
    constructor: function (config) {
        this.initConfig( config );
        
        // TODO Iterate over this.item's children and create "DD.model.PaperItem" items and add them to 'this'.
        
        this.callParent(arguments);
    },
    
});

