'use strict';

/* extend dataTable pagination */
$.fn.dataTableExt.oPagination.input = {
    "fnInit": function (oSettings, nPaging, fnCallbackDraw) {
        var nFirst = document.createElement('span');
        var nPrevious = document.createElement('span');
        var nNext = document.createElement('span');
        var nLast = document.createElement('span');
        var nInput = document.createElement('input');
        var nPage = document.createElement('span');
        var nOf = document.createElement('span');

        nFirst.innerHTML = oSettings.oLanguage.oPaginate.sFirst;
        nPrevious.innerHTML = oSettings.oLanguage.oPaginate.sPrevious;
        nNext.innerHTML = oSettings.oLanguage.oPaginate.sNext;
        nLast.innerHTML = oSettings.oLanguage.oPaginate.sLast;

        nFirst.className = "paginate_button first disabled";
        nPrevious.className = "paginate_button previous disabled";
        nNext.className = "paginate_button next";
        nLast.className = "paginate_button last";
        nOf.className = "paginate_of";
        nPage.className = "paginate_page";
        nInput.className = "paginate_input";

        if (oSettings.sTableId !== '') {
            nPaging.setAttribute('id', oSettings.sTableId + '_paginate');
            nPrevious.setAttribute('id', oSettings.sTableId + '_previous');
            nPrevious.setAttribute('id', oSettings.sTableId + '_previous');
            nNext.setAttribute('id', oSettings.sTableId + '_next');
            nLast.setAttribute('id', oSettings.sTableId + '_last');
        }

        nInput.type = "text";
        nPage.innerHTML = "跳转至 ";
        nOf.innerHTML = "页";

        nPaging.appendChild(nPage);
        nPaging.appendChild(nInput);
        nPaging.appendChild(nOf);
        //nPaging.appendChild( nFirst );
        nPaging.appendChild(nPrevious);
        nPaging.appendChild(nNext);
        //nPaging.appendChild( nLast );

        $(nFirst).click(function () {
            var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
            if (iCurrentPage != 1) {
                oSettings.oApi._fnPageChange(oSettings, "first");
                fnCallbackDraw(oSettings);
                $(nFirst).addClass('disabled');
                $(nPrevious).addClass('disabled');
                $(nNext).removeClass('disabled');
                $(nLast).removeClass('disabled');
            }
        });

        $(nPrevious).click(function () {
            var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
            if (iCurrentPage != 1) {
                oSettings.oApi._fnPageChange(oSettings, "previous");
                fnCallbackDraw(oSettings);
                if (iCurrentPage == 2) {
                    $(nFirst).addClass('disabled');
                    $(nPrevious).addClass('disabled');
                }
                $(nNext).removeClass('disabled');
                $(nLast).removeClass('disabled');
            }
        });

        $(nNext).click(function () {
            var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
            if (iCurrentPage != Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength))) {
                oSettings.oApi._fnPageChange(oSettings, "next");
                fnCallbackDraw(oSettings);
                if (iCurrentPage == (Math.ceil((oSettings.fnRecordsDisplay() - 1) / oSettings._iDisplayLength) - 1)) {
                    $(nNext).addClass('disabled');
                    $(nLast).addClass('disabled');
                }
                $(nFirst).removeClass('disabled');
                $(nPrevious).removeClass('disabled');
            }
        });

        $(nLast).click(function () {
            var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;
            if (iCurrentPage != Math.ceil((oSettings.fnRecordsDisplay() / oSettings._iDisplayLength))) {
                oSettings.oApi._fnPageChange(oSettings, "last");
                fnCallbackDraw(oSettings);
                $(nFirst).removeClass('disabled');
                $(nPrevious).removeClass('disabled');
                $(nNext).addClass('disabled');
                $(nLast).addClass('disabled');
            }
        });

        $(nInput).keyup(function (e) {
            if (e.which == 38 || e.which == 39) {
                this.value++;
            }
            else if ((e.which == 37 || e.which == 40) && this.value > 1) {
                this.value--;
            }

            if (this.value === "" || this.value.match(/[^0-9]/)) {
                this.value = this.value.replace(/[^\d]/g, '');
                return;
            }
        });

        $(nInput).keypress(function(e){
            if(e.which == 13) {
                var iNewStart = oSettings._iDisplayLength * (this.value - 1);
                if (iNewStart < 0) {
                    iNewStart = 0;
                }
                if (iNewStart >= oSettings.fnRecordsDisplay()) {
                    iNewStart = (Math.ceil((oSettings.fnRecordsDisplay() - 1) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
                }

                if (iNewStart === 0) {
                    $(nFirst).addClass('disabled');
                    $(nPrevious).addClass('disabled');
                    $(nNext).removeClass('disabled');
                    $(nLast).removeClass('disabled');
                }
                else if (iNewStart == ((Math.ceil((oSettings.fnRecordsDisplay() - 1) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength)) {
                    $(nNext).addClass('disabled');
                    $(nLast).addClass('disabled');
                    $(nFirst).removeClass('disabled');
                    $(nPrevious).removeClass('disabled');
                }
                else {
                    $(nFirst).removeClass('disabled');
                    $(nPrevious).removeClass('disabled');
                    $(nNext).removeClass('disabled');
                    $(nLast).removeClass('disabled');
                }

                oSettings._iDisplayStart = iNewStart;
                fnCallbackDraw(oSettings);
            }
        });

        $('span', nPaging).bind('mousedown', function () {
            return false;
        });
        $('span', nPaging).bind('selectstart', function () {
            return false;
        });

        var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
        if (iPages <= 1) {
            $(nPaging).hide();
        }
    },

    "fnUpdate": function (oSettings, fnCallbackDraw) {
        if (!oSettings.aanFeatures.p) {
            return;
        }
        var iPages = Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength);
        var iCurrentPage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength) + 1;

        var an = oSettings.aanFeatures.p;
        if (iPages <= 1) {
            $(an).hide();
        }
        else {
            $(an).show();

            for (var i = 0, iLen = an.length; i < iLen; i++) {
                //var spans = an[i].getElementsByTagName('span');
                var inputs = an[i].getElementsByTagName('input');
                //spans[3].innerHTML = " of " + iPages;
                inputs[0].value = iCurrentPage;
            }
        }
    }
};

(function ($) {
    $.fn.selectpicker.defaults = {
        noneSelectedText: '没有选中任何项',
        noneResultsText: '没有找到匹配项',
        countSelectedText: '选中{1}中的{0}项',
        maxOptionsText: ['超出限制 (最多选择{n}项)', '组选择超出限制(最多选择{n}组)'],
        multipleSeparator: ', ',
        selectAllText: "全选",
        deselectAllText: "全不选"
    };
})(jQuery);