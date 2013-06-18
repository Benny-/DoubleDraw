
Ext.define('DD.view.ColorPicker' ,{
    extend: 'Ext.window.Window',
    alias: 'widget.colorpicker',
    
    listeners: {
        render: function(c) {
            $('#InlinejPicker').jPicker({
                window:
                {
                    alphaSupport: true,
                },
                color:
                {
                    active: new $.jPicker.Color({ ahex: '99330099' })
                }
            });
        }
    },
    
    initComponent: function() {
        this.callParent(arguments);
        this.html = '<div id="InlinejPicker"></div>';
        this.height = 335;
        this.width = 560;
        this.draggable = true;
    },
    
});
