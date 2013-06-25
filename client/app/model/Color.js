
Ext.define('DD.model.Color', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'Name', type: 'string'},
        {name: 'r', type: 'int'},
        {name: 'g', type: 'int'},
        {name: 'b', type: 'int'},
        {name: 'a', type: 'float'},
    ],
    belongsTo : 
    {
        name:'palette',
        model:'DD.model.Palette',
    },
    
    constructor: function () {
        
        // The change event is fired if the color values have changed.
        // Any view should update its colors to match.
        this.addEvents({
            "change"    : true,
        });
        this.callParent( arguments );
    },
    
    // Swaps values of two DD.model.Color objects.
    swap: function(other) {
        var temp;
        
        temp = other.get('r');
        other.set('r', this.get('r'));
        this.set('r',temp);
        
        temp = other.get('g');
        other.set('g', this.get('g'));
        this.set('g',temp);
        
        temp = other.get('b');
        other.set('b', this.get('b'));
        this.set('b',temp);
        
        temp = other.get('a');
        other.set('a', this.get('a'));
        this.set('a',temp);
        
        this.fireEvent("change");
        other.fireEvent("change");
    },
    
    loadjPickerColor: function(jPickerColor) {
        this.set('r', jPickerColor.val('r'));
        this.set('g', jPickerColor.val('g'));
        this.set('b', jPickerColor.val('b'));
        this.set('a', jPickerColor.val('a')/255.0);
        this.fireEvent("change");
    },
    
    // toHex does not include the alpha value.
    toHex: function() {
        
        var componentToHex = function(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        
        return "#" + componentToHex(this.get('r')) + componentToHex(this.get('g')) + componentToHex(this.get('b'));
    },
    
    import: function(data) {
        this.set('r', data.r );
        this.set('g', data.g );
        this.set('b', data.b );
        this.set('a', data.a );
        this.fireEvent("change");
    },
    
    
    export: function() {
        return {
            r: this.get('r'),
            g: this.get('g'),
            b: this.get('b'),
            a: this.get('a'),
        }
    },
    
});
