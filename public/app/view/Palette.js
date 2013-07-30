
/*
Some lines in this class are commented. They refer to the editing features of 
a extjs grid. But they didden't work for some reason.
*/

Ext.define('DD.view.Palette' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.palette',
    // selType: 'rowmodel',
    // rowEditor: Ext.create('Ext.grid.plugin.RowEditing', {
    //     clicksToEdit: 2
    // }),
    
    columns: [
        {
            header: "Color",
            sortable:false,
            hideable: false,
            width:40,
            renderer: function(value, meta, record) {
                var container_id = Ext.id(),
                    container = '<div id="' + container_id + '"></div>';
                
                var colorBox = Ext.create("DD.view.ColorBox", {
                    color:record,
                    delayedRenderTo: container_id,
                });
                
                colorBox.editable = this.editable;
                
                return container;
            },
        },
        {
            header: 'Name',
            dataIndex: 'name',
            // editor: {
            //     xtype: 'textfield',
            //     allowBlank: true
            // },
        },
        {
            header: "Red",
            dataIndex: 'r',
            width:40,
            hidden:true,
        },
        {
            header: "Green",
            dataIndex: 'g',
            width:40,
            hidden:true,
        },
        {
            header: "Blue",
            dataIndex: 'b',
            width:40,
            hidden:true,
        },
        {
            header: "Alpha",
            dataIndex: 'a',
            width:40,
            hidden:true,
        },
        {
            header: "Hex",
            dataIndex: 'a',
            hidden:true,
            renderer: function(value, meta, record) {
                return record.toHex();
            },
        },
        {
            header: "Descriptive name",
            sortable:true,
            hidden:true,
            renderer: function(value, meta, record) {
                return ntc.name(record.toHex())[1];
            },
        },
    ],
    
    config: {
        editable: false,
        palette: null,
    },
    
    constructor: function (config) {
        this.initConfig( config );
        this.title = this.palette.get('name');
        this.store = this.palette.colors();
        // this.plugins = [ this.rowEditor ];
        this.callParent(arguments);
    },
    
    initComponent: function() {
        this.callParent(arguments);
    }
});
