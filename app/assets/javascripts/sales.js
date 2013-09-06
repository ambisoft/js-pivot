
var PivotTableApp = window.PivotTableApp ? window.PivotTableApp : {};

(function(d, $) {

    PivotTableApp.sales = {

    init: function(sales_url) {
        var self = this;

        this._initDataTable(sales_url);
        this._initDialog();
        this._initDraggables();
        this._initDroppables();

        $('#btn-configure-pivot').click(function(e) {
            self._openDialog();
        });
    },

    _initDialog: function() {
        $('#dialog-modal').dialog({
          autoOpen: false,
          width: 950,
          height: 500,
          resizable: false,
          draggable: false,
          modal: true
        });
    },

    _openDialog: function() {
        this._resetDialog();
        $('#dialog-modal').dialog('open');
    },

    _resetDialog: function() {

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
    },

    _initDataTable: function(sales_url) {
        $(d).on('click', '#sales tbody tr', function() {
            $(this).toggleClass('row_selected');
            return false;
        });
        $('#sales').dataTable({
            // sort by day of week, then by product name
            "aaSorting": [ [2,'asc'], [0,'asc'], [1, 'asc'] ],
            "bPaginate": false,
            "bProcessing": true,
            "sAjaxSource": sales_url,
            "aoColumns": [
                { "bVisible": true },
                { "bVisible": true },
                // invisible column - numeric day of week - used for sorting:
                { "bVisible": false },
                { "bVisible": true },
                { "bVisible": true, sClass: 'amount' }
           ]
        });
    },

    _initDraggables: function() {
        this._createColumns();
        $('.draggable-columns li').draggable({
          opacity: 0.7, helper: 'clone'
        });
    },

    _createColumns: function() {
        var draggables = $('.draggable-columns');
        var cols = $('#sales thead th');
        $(cols).each(function() {
            draggables.append($('<li/>').addClass('draggable-column').text($(this).text()));
        });
    },

    _initDroppables: function() {

        var self = this;

        $('.pivot-roles li').droppable({
          accept: '.draggable-column'
        });

        var pivotRowLabels = $('.pivot-roles li.pivot-row-labels');
        var pivotColumnLabels = $('.pivot-roles li.pivot-column-labels');
        var pivotValues = $('.pivot-roles li.pivot-values');

        pivotRowLabels.on('drop', function(event, ui) {
          var columnName = ui.draggable.text();
          self._rowLabelDropped(pivotRowLabels, columnName);
        });

        pivotColumnLabels.on('drop', function(event, ui) {
          var columnName = ui.draggable.text();
          self._columnLabelDropped(pivotColumnLabels, columnName);
        });

        pivotValues.on('drop', function(event, ui) {
          var columnName = ui.draggable.text();
          self._valueDropped(pivotValues, columnName);
        });
    },

    _rowLabelDropped: function(pivotRowLabels, columnName) {


        if (columnName != 'Product') {
            alert('Only Product column can be dropped here in this demo!');
            return;
        }
        
        $('div', pivotRowLabels).text(columnName);

        var item = $(".draggable-columns li:contains('" + columnName + "')");
        item.addClass('selected');
        $(item.get(0)).draggable("disable");

        var pivotTable = $('#table-pivot');
        var headRow = pivotTable.find('thead').find('tr');
        if (!headRow.length) {
            headRow = $('<tr/>');
            headRow.append($('<th/>').text('Row Labels'));
            pivotTable.find('thead').append(headRow);
            var uniqueValues = this._uniqueValues(columnName);
            $(uniqueValues).each(function() {
                var row = $('<tr/>');
                row.append($('<td/>').text(this));
                pivotTable.find('tbody').append(row);
            });
        }
    },

    _uniqueValues: function(columnName) {
        var idx = $('#sales thead').find('th:contains(' + columnName + ')').index();
        var values = {};
        $('#sales tbody tr').each(function() {
            var value = $(this).find('td:eq(' + idx + ')').text();
            values[value] = 1;
        });
        return _.keys(values);
    },

    _columnLabelDropped: function(pivotColumnLabels, columnName) {

        if (columnName != 'Day') {
            alert('Only Day column can be dropped here in this demo!');
            return;
        }

        var pivotTable = $('#table-pivot');
        var headRow = pivotTable.find('thead').find('tr');
        if (!headRow.length) {
            alert('Select Row Label first!');
        } else {
            var item = $(".draggable-columns li:contains('" + columnName + "')");
            item.addClass('selected');
            $(item.get(0)).draggable("disable");
            $('div', pivotColumnLabels).text(columnName);
            var uniqueValues = this._uniqueValues(columnName);
            $(uniqueValues).each(function() {
                var cell = $('<th/>').text(this);
                headRow.append(cell);
            });
        }
    },

    _valueDropped: function(pivotValues, columnName) {

        if (columnName != 'Sales') {
            alert('Only Sales column can be dropped here in this demo!');
            return;
        }

        var self = this;

        var pivotTable = $('#table-pivot');
        var headRow = pivotTable.find('thead').find('tr');

        if (!headRow.length) {
            alert('Select Row Label first!');
        } else {
            var colsCount = headRow.find('th').length - 1;
            if (colsCount == 0) {
                alert('Select Column Labels first!');
            } else {

                var item = $(".draggable-columns li:contains('" + columnName + "')");
                item.addClass('selected');
                $(item.get(0)).draggable("disable");
                $('div', pivotValues).text(columnName);

                var rowLabel = $('.pivot-row-labels div').text();
                var columnLabels = $('.pivot-column-labels div').text();

                var rowLabelIdx = this._columnIndex(rowLabel);
                var colLabelIdx = this._columnIndex(columnLabels);
                var valueColumnIdx = this._columnIndex(columnName);

                var pivotInfo = {
                    rowLabel: rowLabel,
                    rowLabelIdx: rowLabelIdx,
                    columnLabels: columnLabels,
                    columnLabelsIdx: colLabelIdx,
                    valueColumn: columnName,
                    valueColumnIdx: valueColumnIdx
                };

                pivotTable.find('tbody tr').each(function(rowIndex) {
                    var row = $(this);
                    for (var col = 0; col < colsCount; col++) {
                        var rowName = row.find('td:first').text();
                        var colName = headRow.find('th:eq(' + (col + 1) + ')').text();
                        var cell = $('<td/>').text(self._calculateSum(pivotInfo, rowName, colName));
                        row.append(cell);
                    }
                });
            }
        }
    },

    _columnIndex: function(colName) {
        return $('#sales thead').find('th:contains(' + colName + ')').index();
    },

    _rowMatches: function(row, pivotInfo, rowName, colName) {
        var rowValue = row.find('td:eq(' + pivotInfo.rowLabelIdx + ')').text();
        var colValue = row.find('td:eq(' + pivotInfo.columnLabelsIdx + ')').text();
        return (rowValue == rowName) && (colValue == colName);
    },

    _calculateValueForRow: function(row, pivotInfo) {
        var val = row.find('td:eq(' + pivotInfo.valueColumnIdx + ')').text();
        console.log(val);
        return parseFloat(val);
    },

    _calculateSum: function(pivotInfo, rowName, colName) {

        var result = 0;

        var self = this;
        $('#sales tbody tr').each(function() {
            var row = $(this);
            if (self._rowMatches(row, pivotInfo, rowName, colName)) {
                result += self._calculateValueForRow(row, pivotInfo);
            }
        });

        return result;
    }

};

})(document, jQuery);