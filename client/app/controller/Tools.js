Ext.define('DD.controller.Tools', {
    extend: 'Ext.app.Controller',

    views: [
        'Tools'
    ],

    init: function() {
        
        this.control({
            'tools': {
                render: this.onPanelRendered,
            }
        });
    },
    
    onPanelRendered: function(panel) {
        var self = this;
        this.application.on("PaperReady", function() {
            for (var i = 0; i < tool_creator.length; i++) {
                var tool = tool_creator[i](self.application.paper); // Using global paperScope here.
                console.log(tool)
                panel.add(
                Ext.create('Ext.Button', {
                    text: 'Click me',
                    renderTo: Ext.getBody(),
                    handler: function() {
                        tool.activate();
                    }
                }));
            }
        })
    },
});
