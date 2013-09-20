
Ext.define('DD.view.Layers' ,{
    extend: 'Ext.tree.Panel',
    alias: 'widget.layers',
    
    title: 'Simple Tree',
    width: 200,
    height: 150,
    store: 'PaperItems',
    rootVisible: false,
    
    columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'Hierarchy',
                flex: 1,
                sortable: false,
            },
            {
                text: 'Type',
                flex: 2,
                sortable: false,
				dataIndex: 'type'
            },
    ],
    
});

