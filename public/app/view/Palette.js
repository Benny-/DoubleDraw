
Ext.define('DD.view.Palette' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.palette',
    
    tools:[
        {
            type:'Delete',
            tooltip: 'Delete this palette',
        },
    ],
    
    columns: [
        {header: "Color",  sortable:false, width:40, renderer: function(value, meta, record) {
                var container_id = Ext.id(),
                    container = '<div id="' + container_id + '"></div>';
                
                Ext.create("DD.view.ColorBox", {
                    color:record,
                    delayedRenderTo: container_id,
                });
                
                return container;
            }
        },
        {header: 'Name',  dataIndex: 'name',},
    ],
    
    constructor: function (config) {
        this.palette = config.palette;
        this.title = this.palette.get('name');
        this.store = this.palette.colors();
        this.callParent(arguments);
    },
    
    initComponent: function() {
        this.callParent(arguments);
    }
});
