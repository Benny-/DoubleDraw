Ext.define('DD.store.Messages', {
    extend: 'Ext.data.Store',
    model: 'DD.model.Message',
    
    data: [
        
    ],
    
    sorters: [
        {
            property: 'processedDate',
            direction: 'DESC'
        },
     ],
});
