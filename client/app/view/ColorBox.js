
Ext.define('DD.view.ColorBox' ,{
    extend: 'Ext.container.Container',
    alias: 'widget.colorbox',
    
    models: [
        'Color'
    ],
    
    color: null,
    
    initComponent: function() {
        this.color = Ext.create("DD.model.Color",255, 48, 48, 1);
        this.html = '<div class="colorBoxBackground"> <div class="colorBox" id="colorSelectionPrimary"   ></div></div>';
        this.callParent(arguments);
    },
});
