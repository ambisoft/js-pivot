var PivotTableApp = window.PivotTableApp ? window.PivotTableApp : {};

(function(d, $) {
    
    PivotTableApp.dialog = {
        
        init: function() {            
            $('#dialog-modal').dialog({
              autoOpen: false,
              width: 950,
              height: 500,
              resizable: false,
              draggable: false,
              modal: true
            });
            return this;
        },
        
        open: function() {
            this._reset();
            $('#dialog-modal').dialog('open');
        },
               
        _reset: function() {
            this._resetPivotTable();
            this._resetDraggableCols();
            this._resetPivotRoles();
        },

        _resetPivotTable: function() {
            var pivot = $('#table-pivot');
            $('thead', pivot).empty();
            $('tbody', pivot).empty();
        },

        _resetDraggableCols: function() {
            $('ul.draggable-columns li').each(function() {
                $(this).removeClass('selected');
                $(this).draggable("enable");
            });
        },

        _resetPivotRoles: function() {
            $('ul.pivot-roles').each(function() {
                $('div', this).empty();
            });
        }        
    }
})(document, jQuery);
