
Ext.define('DD.view.Canvas' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.canvas',
    
    initComponent: function() {
        var me = this;
        this.callParent(arguments);
        
        me.addEvents(
            'canvasMouseEnter',
            'canvasMouseLeave'
        );
    },
    
    afterRender: function() {
        var me = this;
        me.callParent();

        me.mon(me.getEl(), 'mouseenter', function() {
            this.fireEvent('canvasMouseEnter')
        }, me);
        
        me.mon(me.getEl(), 'mouseleave', function() {
            this.fireEvent('canvasMouseLeave')
        }, me);
    }
    
});

