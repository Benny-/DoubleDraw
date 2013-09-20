
Ext.define('DD.store.PaperItems', {
    extend: 'Ext.data.TreeStore',
    model: 'DD.model.PaperItem',
    
    root: {
        expanded: true,
        children: [
        	
        ],
    }
});

