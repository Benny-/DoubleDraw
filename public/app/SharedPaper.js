
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
    var paper = require('paper');
    var PaperTool = require('./model/tools/PaperTool.js');
    var UserDrawContext = require('./UserDrawContext.js');
}

/**
 * Paperjs does not support multiple people drawing on a shared paper.
 * It is this class's responsebility to ensure it can.
 **/
Ext.define('DD.SharedPaper',{
    
    constructor: function (paperScope, toolDescriptions) {
        this.callParent( arguments );
        
        this.users = {}; // Map. keys are user_id's and the values are user objects.
        this.toolDescriptions = {};
        this.paperScope = paperScope;
        this.toolDescriptions = toolDescriptions.clone();
        
        this.paperScope.activate();
        this.sharedProject = new this.paperScope.Project(this.paperScope.view);
        this.uiProject = new this.paperScope.Project(this.paperScope.view);
    },
    
    colorChange: function(user_id, color)
    {
        var user = this.users[user_id];
        user.setColor(color);
    },
    
    userToolChange: function(user_id, tool)
    {
        var user = this.users[user_id];
        var newTool = user.tools[tool.uuid];
        if(!newTool)
            throw new Error("User used a unknown tool:", tool.uuid);
        user.tool.toolChange();
        user.tool = newTool;
        user.tool.toolUse();
    },
    
    userToolEvent: function(user_id, toolEvent)
    {
        var user = this.users[user_id];
        var tool = user.tool;
        this.paperScope.activate(); // Note: Activating this paperScope is actually only required on NodeJS, as only the server side program uses multiple paper-scopes.
        this.getSharedProject().activate();
        var importedToolEvent = this.importToolEvent(toolEvent);
        tool.fire(toolEvent.type, importedToolEvent );
        return importedToolEvent;
    },
    
    addToolDescription: function(toolDescription)
    {
        this.toolDescriptions.push(toolDescription);
        
        var user_ids = Object.keys(this.users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = this.users[user_ids[i]];
            user.addToolDescription(toolDescription, this.paperScope);
        }
    },
    
    addUser: function(user)
    {
        user = new DD.UserDrawContext(user, this.toolDescriptions, this);
        this.users[user.user_id] = user;
    },
    
    removeUser: function(user_id)
    {
        return delete this.users[user_id];
    },
    
    removeAllUsers: function()
    {
    	this.users = {};
    },
    
    getSharedProject: function()
    {
        return this.sharedProject;
    },
    
    getUiProject: function()
    {
        return this.uiProject;
    },
    
    getUser: function(user_id)
    {
        return this.users[user_id];
    },
    
    getUsers: function()
    {
        return this.users;
    },
    
    getToolDescriptions: function()
    {
        return this.toolDescriptions;
    },
    
    getPaperScope: function()
    {
        return this.paperScope;
    },
    
    paperSerializers: {
        item: {
            export: function(item) {
                var exportedItem = ['item'];
                var project = this.getSharedProject();
                
                var recursiveExportItem = function(exportedItem, item)
                {
                    if(item.parent)
                        recursiveExportItem(exportedItem, item.parent);
                    exportedItem.push(item.index);
                }
                
                recursiveExportItem(exportedItem, item);
                
                return exportedItem;
            },
            import: function(exportedItem) {
                
                // First we get the correct layer.
                var item = this.getSharedProject().layers[exportedItem[1]];
                
                // And then we go down the rabbit hole, Wheee!
                for(var i = 2; i<exportedItem.length; i++)
                {
                    item = item.children[ exportedItem[i] ];
                }
                
                return item;
            },
        },
        segment: {
            export: function(segment)
            {
                return ['Segment', segment.index, this.paperSerializers.item.export.call(this, segment.path) ];
            },
            import: function(exportedSegment)
            {
                var path = this.paperSerializers.item.import.call(this, exportedSegment[2]);
                var segment = path.segments[exportedSegment[1]];
                return segment;
            },
        },
        curve: {
            export: function(curve)
            {
                return ['Curve', curve.index, this.paperSerializers.item.export.call(this, curve.path) ];
            },
            import: function(exportedCurve)
            {
                var path = this.paperSerializers.item.import.call(this, exportedCurve[2]);
                var curve = path.curves[exportedCurve[1]];
                return curve;
            },
        },
        curveLocation: {
            export: function(curveLocation)
            {
                return ['CurveLocation', this.paperSerializers.curve.export.call(this, curveLocation.curve), curveLocation.parameter, curveLocation.point.toJSON() ];
            },
            import: function(exportedCurveLocation)
            {
                var curve = this.paperSerializers.curve.import.call(this, exportedCurveLocation[1]);
                var parameter = exportedCurveLocation[2];
                var exportedPoint = exportedCurveLocation[3];
                var point = new paper.Point(exportedPoint[0], exportedPoint[1]);
                return new paper.CurveLocation(curve, parameter, point);
            },
        },
    },
    
    exportPaperThing: function(paperThing)
    {
        var isPaperJsItem = function(possibleItem) {
            var proto = Object.getPrototypeOf(possibleItem);
            if (proto)
            {
                if (proto._class == 'Item') {
                    return true;
                }
                else
                {
                    return isPaperJsItem.call(this, proto);
                }
            }
            return false;
        };
        
        if( paperThing == null || typeof paperThing == 'undefined' || typeof paperThing == 'number' || typeof paperThing == 'string' || typeof paperThing == 'boolean')
            return paperThing; // Primitive types can directly be exported
        else if(paperThing._class == 'Segment')
            return this.paperSerializers.segment.export.call(this, paperThing);
        else if(paperThing._class == 'Curve')
            return this.paperSerializers.curve.export.call(this, paperThing);
        else if(paperThing._class == 'CurveLocation')
            return this.paperSerializers.curveLocation.export.call(this, paperThing);
        else if(isPaperJsItem.call(this, paperThing))
            return this.paperSerializers.item.export.call(this, paperThing);
        else if(paperThing._class == 'Point') // Basic paperjs items can be directly converted to json. They have no relation to another paperjs object in the same paperscope (XXX: Not entirely true).
            return paperThing.toJSON();
        else if(paperThing._class == 'Size')
            return paperThing.toJSON();
        else if(paperThing._class == 'Rectangle')
            return paperThing.toJSON();
        else
            throw new Error("Can't export "+key+": " + paperThing);
    },
    
    importPaperThing: function(exportedPaperThing)
    {
        var value = exportedPaperThing;
        if( value == null || typeof value == 'undefined' || typeof value == 'number' || typeof value == 'string' || typeof value == 'boolean')
            return value; // Primitive types can directly be exported
        else if(value[0] === 'item')
            return this.paperSerializers.item.import.call(this, value);
        else if(value[0] === 'Segment')
            return this.paperSerializers.segment.import.call(this, value);
        else if(value[0] === 'Curve')
            return this.paperSerializers.curve.import.call(this, value);
        else if(value[0] === 'CurveLocation')
            return this.paperSerializers.curveLocation.import.call(this, value);
        else
            // What is going on here?
            // Well..
            // Basic types are serialized like this: ["Point",3,6]
            // Basic types can be created like this: new paper.Point(3, 6)
            // We are directly converting a serialized form of a basic type to a real basic object
            // by picking a different constructor during runtime.
            return new paper[value[0]](value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12]);
    },
    
    exportToolEvent: function(event)
    {
        return {
            type: event.type,
            point    : event.point          ?   { x: event.point.x, y: event.point.y}         : null,
            lastPoint: event.lastPoint      ?   { x: event.lastPoint.x, y: event.lastPoint.y} : null,
            downPoint: event.downPoint      ?   { x: event.downPoint.x, y: event.downPoint.y} : null,
            middlePoint: event.middlePoint  ?   { x: event.middlePoint.x, y: event.middlePoint.y} : null,
            delta: event.delta              ?   { x: event.delta.x, y: event.delta.y} : null,
            count: event.count,
            character: event.character, // This attribute exist only for a KeyEvent.
            key: event.key,             // This attribute exist only for a KeyEvent.
            event: { which:event.event.which },
            item: this.exportPaperThing(event.item),
        }
    },
    
    importToolEvent: function(event)
    {
        return {
            type: event.type,
            point: new this.paperScope.Point(event.point),
            lastPoint: event.lastPoint ? new this.paperScope.Point(event.lastPoint) : null,
            downPoint: event.downPoint ? new this.paperScope.Point(event.downPoint) : null,
            middlePoint: event.middlePoint ? new this.paperScope.Point(event.middlePoint) : null,
            delta: new this.paperScope.Point(event.delta),
            count: event.count,
            character: event.character,
            key: event.key,
            event: event.event,
            item: this.importPaperThing(event.item),
        }
    },
    
    import: function(sharedPaper) {
    
        this.getSharedProject().clear();
        this.getSharedProject().importJSON(sharedPaper.paperProject);
        
        this.removeAllUsers();
        
        for (var i = 0; i < sharedPaper.users.length; i++) {
            this.addUser(sharedPaper.users[i]);
        }
    },
    
    export: function() {
        var exported_sharedPaper = {
            paperProject: this.paperScope.project.exportJSON(),
            users: [],
        };
        
        var user_ids = Object.keys(this.users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = this.users[user_ids[i]];
            exported_sharedPaper.users.push(user.export());
        }
        
        return exported_sharedPaper;
    },
    
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.SharedPaper;
}
