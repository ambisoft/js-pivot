var PivotTableApp = window.PivotTableApp ? window.PivotTableApp : {};

(function(d, $) {

    PivotTableApp.table_columns = {

        init: function() {
            this._createColumns();
            $('.draggable-columns li').draggable({
                opacity: 0.7, 
                helper: 'clone',
                containment: "#dialog-modal"                
            });
            return this;
        },
        
        findColumn: function(columnName) {
            return $(".draggable-columns li:contains('" + columnName + "')");
        },

        _createColumns: function() {
            var draggables = $('.draggable-columns');
            var cols = $('#sales thead th');
            $(cols).each(function() {
                var columnName = $.trim($(this).text());
                if (columnName.length > 0) {
                    draggables.append($('<li/>').addClass('draggable-column').text(columnName));
                }
            });
        }
    };

})(document, jQuery);