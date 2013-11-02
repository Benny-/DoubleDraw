
Ext.define('DD.controller.Menu', {
    extend: 'Ext.app.Controller',
    
    init: function() {
        
        this.control({
            'menuitem#file_menu_save': {
                click: this.onSave
            },
            
            'menuitem#file_menu_export_svg': {
                click: this.onExportSVG
            },
            
            'menuitem#file_menu_export_png': {
                click: this.onExportPNG
            },
        });
        
    },
    
    onSave : function(){
        var json_string = this.application.sharedPaperUser.getSharedProject().exportJSON();
        var blob = new Blob([json_string], {type: "application/json"});
        saveAs(blob, "image.paperjs.json");
    },
    
    // TODO: Check why exported svg can't be viewed in some image viewers.
    onExportSVG : function(){
        var serializer= new XMLSerializer();
        var svg = this.application.sharedPaperUser.getSharedProject().exportSVG();
        var svg_string = serializer.serializeToString(svg);
        var blob = new Blob([svg_string], {type: "image/svg+xml;charset=" + svg.characterSet});
        saveAs(blob, "image.svg");
        
        // var blobbuilder = new BlobBuilder();
        // var svg = this.application.sharedPaperUser.getSharedProject().exportSVG();
        // blobbuilder.append(svg);
        // var blob = blobbuilder.getBlob("image/svg+xml;charset=" + svg.characterSet);
        // saveAs(blob,"image.svg");
    },
    
    onExportPNG : function(){
        this.application.canvas.toBlob(function(blob) { saveAs(blob, "image.png");});
    },
});
