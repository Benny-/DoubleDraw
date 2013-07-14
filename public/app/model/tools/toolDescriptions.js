
ToolDescriptions = {};

ToolDescriptions.push = function (toolDescription) {
    if( !this[toolDescription.uuid] )
        this[toolDescription.uuid] = {};
    
    this[toolDescription.uuid][toolDescription.version] = toolDescription;
};

ToolDescriptions.get = function (uuid, version) {
    return this[uuid][version];
};

ToolDescriptions.forEach = function (fn, scope) {
    
    var uuid_keys = Object.keys(this);
    uuid_keys.forEach(function(uuid) {
        if(typeof this[uuid] != 'function')
        {
            var version_keys = Object.keys(this[uuid]);
            version_keys.forEach(function(version) {
                fn.call(scope, this[uuid][version]);
            }, this);
        }
    }, this);
};

ToolDescriptions.clone = function () {
    var clone = {};
    clone.push = this.push;
    clone.get = this.get;
    clone.forEach = this.forEach;
    this.forEach( function(toolDescription) {
        clone.push(toolDescription);
    });
    return clone;
};
