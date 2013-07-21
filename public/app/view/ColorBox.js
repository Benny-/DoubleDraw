
Ext.define('DD.view.ColorBox' ,{
    extend: 'Ext.container.Container',
    alias: 'widget.colorbox',
    
    models: [
        'Color'
    ],
    
    config: {
        color       : null,
    },
    
    innerColorBox: null,
    
    initComponent: function() {
        if (this.delayedRenderTo) {
            this.delayRender();
        }
        
        this.addEvents({
            "click" : true,
        });
        if(!this.color)
            this.color = Ext.create("DD.model.Color");
        this.html = '<div class="colorBoxBackground"> <div class="colorBox" id="innerColorBox-'+this.getId()+'"></div></div>';
        this.callParent(arguments);
    },
    
    listeners: {
        render : function(c) {
            
            // Ext.container.Container does not fire the "click" event.
            // But I need to know if a color box has been clicked.
            // This code ensures the click event can/will be fired.
            c.getEl().on('click', function(){ this.fireEvent('click', c); }, c);
            
            this.innerColorBox = document.getElementById('innerColorBox-'+this.getId());
            this.loadColor(this.color);
        }
    },
    
    update: function() {
        this.innerColorBox.style.background = this.color.toHex();
        this.innerColorBox.style.opacity = this.color.get("a");
    },
    
    loadColor: function(color) {
        this.color.removeListener( 'change', this.update, this);
        this.color = color;
        this.update();
        this.color.on( 'change', this.update, this );
    },
    
    destroy: function() {
        this.color.removeListener( 'change', this.update, this);
        this.callParent(arguments);
    },
    
    delayRender: function () {
        Ext.TaskManager.start({
            scope: this,
            interval: 100,
            run: function () {
                var container = Ext.fly(this.delayedRenderTo);

                if (container) {
                    this.render(container);
                    return false;
                } else {
                    return true;
                }
            }
        });
    }
    
});
