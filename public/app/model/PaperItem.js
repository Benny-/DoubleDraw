Ext.define('DD.model.PaperItem', {
    extend: 'Ext.data.TreeModel',
    
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
        this.callParent( arguments );
        
        if(this.item)
        {
        	this.setId( this.item.id ); // The id's from the paper item's are unique on the local machine.
        								// A remote machine might have different id's for the same graphics.
        	if(this.item.children)
        	{
				for (var i = 0; i < this.item.children.length; i++) {
					var child = this.item.children[i];
					var childNode = Ext.create("DD.model.PaperItem", {item:child, children:[] } );
					this.appendChild( childNode , true);
				}
			}
		}
		else
			this.setId(0); // For the root node. The root node does not have a "item" property.
    },
    
});

