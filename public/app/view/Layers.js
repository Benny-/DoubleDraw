
Ext.define('DD.view.Layers' ,{
    extend: 'Ext.tree.Panel',
    alias: 'widget.layers',
    
    title: 'Simple Tree',
    width: 200,
    height: 150,
    store: 'PaperItems',
    rootVisible: false,
    
    columns: [
            {
                text: 'id',
                flex: 1,
                sortable: true,
                hidden:true,
				dataIndex: 'id'
            },
    		{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'Hierarchy',
                flex: 2,
                sortable: false,
            },
            {
                text: 'Type',
                flex: 3,
                sortable: true,
				dataIndex: 'type'
            },
    ],
    
});

