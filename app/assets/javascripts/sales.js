
var PivotTableApp = window.PivotTableApp ? window.PivotTableApp : {};

(function(d, $) {

    var _dialog = null;
    var _table_columns = null;

    var _resultDataTableOptions = {
        bPaginate: false,
        bLengthChange: false,
        bInfo: false,
        bFilter: false
    };

    PivotTableApp.sales = {

    init: function(sales_url) {

        _dialog = PivotTableApp.dialog.init();
        _table_columns = PivotTableApp.table_columns.init();

        this._initDataTable(sales_url);
        this._initDroppables();

        $('.btn-configure-pivot').click(function(e) {
            _dialog.open();
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

    _activateDataTableOnResult: function() {
        $('#table-pivot').dataTable(_resultDataTableOptions);
    },

    _rowLabelDropped: function(pivotRowLabels, columnName) {

        var target = $('div', pivotRowLabels);
        if ($.trim(target.text()).length > 0) {
            return;
        }
        target.text(columnName);
        var item = _table_columns.findColumn(columnName);
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

        var pivotTable = $('#table-pivot');
        var headRow = pivotTable.find('thead').find('tr');
        if (!headRow.length) {
            alert('Select Row Label first!');
        } else {
            var target = $('div', pivotColumnLabels);
            if ($.trim(target.text()).length > 0) {
                return;
            }

            var item = _table_columns.findColumn(columnName);
            item.addClass('selected');
            $(item.get(0)).draggable("disable");

            target.text(columnName);
            var uniqueValues = this._uniqueValues(columnName);
            $(uniqueValues).each(function() {
                var cell = $('<th/>').text(this);
                headRow.append(cell);
            });
            
            this._createEmptyCells();
            
            this._activateDataTableOnResult();
        }
    },

    _createEmptyCells: function() {
        var pivotTable = $('#table-pivot');
        var headRow = pivotTable.find('thead').find('tr');
        var colsCount = headRow.find('th').length - 1;
        pivotTable.find('tbody tr').each(function(rowIndex) {
            var row = $(this);
            for (var col = 0; col < colsCount; col++) {
                var cell = $('<td/>').text('-');                                   
                row.append(cell);
            }
        });
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

                var item = _table_columns.findColumn(columnName);
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
                        var cell = row.find('td:eq(' + (col + 1) + ')');
                        cell.addClass('amount').text(self._calculateSum(pivotInfo, rowName, colName));                        
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
        return parseFloat(val);
    },

    _calculateSum: function(pivotInfo, rowName, colName) {

        var result = 0;
        var precision = 2;

        var self = this;
        $('#sales tbody tr').each(function() {
            var row = $(this);
            if (self._rowMatches(row, pivotInfo, rowName, colName)) {
                result += self._calculateValueForRow(row, pivotInfo);
            }
        });

        return result.toFixed(precision);
    }

};

})(document, jQuery);