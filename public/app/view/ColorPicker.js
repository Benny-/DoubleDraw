
Ext.define('DD.view.ColorPicker' ,{
    extend: 'Ext.window.Window',
    alias: 'widget.colorpicker',
    
    models: [
        'Color'
    ],
    
    height          : 335, // TODO: Figure out if Ext.window.Window can automagically resize to fit the jPicker
    width           : 560,
    
    config: {
        color       : null,
    },
    
    listeners: {
        render: function(c) {
            var ColorPicker = this;
            this.initial_r = this.color.get('r');
            this.initial_g = this.color.get('g');
            this.initial_b = this.color.get('b');
            this.initial_a = this.color.get('a');
            $('#InlinejPicker-'+this.getId()+'').jPicker(
                {
                    window:
                    {
                        alphaSupport: true,
                    },
                    color:
                    {
                        active: new $.jPicker.Color({ r:this.color.get('r'), g:this.color.get('g'), b:this.color.get('b'), a:this.color.get('a')*255 })
                    }
                },
                function(jPickerColor, context)
                {
                    // commitCallback
                    ColorPicker.color.loadjPickerColor(jPickerColor);
                    ColorPicker.fireEvent('commit', jPickerColor.val('r'), jPickerColor.val('g'), jPickerColor.val('b'), jPickerColor.val('a')/255.0 );
                },
                function(jPickerColor, context)
                {
                    // liveCallback
                    ColorPicker.color.loadjPickerColor(jPickerColor);
                    ColorPicker.fireEvent('live', jPickerColor.val('r'), jPickerColor.val('g'), jPickerColor.val('b'), jPickerColor.val('a')/255.0 );
                },
                function(jPickerColor, context)
                {
                    // cancelCallback
                    ColorPicker.color.loadjPickerColor(jPickerColor);
                    ColorPicker.fireEvent('cancel', jPickerColor.val('r'), jPickerColor.val('g'), jPickerColor.val('b'), jPickerColor.val('a')/255.0 );
                });
        }
    },
    
    initComponent: function() {
        this.addEvents({
            "commit"    : true,
            "live"      : true,
            "cancel"    : true,
        });
        
        this.color.beginEdit();
        this.on('commit', function() {
            this.color.endEdit();
            this.destroy();
        });
        
        this.on('cancel', function() {
            this.color.cancelEdit();
            this.destroy();
        });
        
        if(!this.color)
            console.log("Assert failed: this.color must be defined")
        
        this.html = '<div id="InlinejPicker-'+this.getId()+'"></div>';
        
        this.callParent(arguments);
    },
    
    close: function() {
        this.color.setRGBA(this.initial_r, this.initial_g, this.initial_b, this.initial_a);
        this.fireEvent('cancel', this.initial_r, this.initial_g, this.initial_b, this.initial_a );
    },
    
    destroy: function() {
        var destroyed = false;
        for (var i=0; i<$.jPicker.List.length; i++)
        {
            if ($.jPicker.List[i].id == ('InlinejPicker-'+this.getId()) )
            {
                $.jPicker.List[i].destroy();
                destroyed = true;
                break;
            }
        }
        
        // TODO: Use some kind of facy assert reporting thingy.
        if(!destroyed)
            console.log("Assert failed: InlinejPicker not destroyed on window close")
        
        this.callParent(arguments);
    },
    
});
