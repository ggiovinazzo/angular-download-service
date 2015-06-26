(function() {
    'use strict';

    var app = angular.module('angular.download.service',
        []
    );
    
    function FileDownload(){

        this.strMimeType = 'application/octet-stream;charset=utf-8';
         
        /**
         * @ngdoc function
         * @name setMimeType
         * @methodOf  angular.download.service:downloadService
         * @param {string} mimeType Mime type for the download
         * @description Sets mime type for current download
         *
         * Original function from: https://github.com/angular-ui/ng-grid/blob/master/src/features/exporter/js/exporter.js
         */
        this.setMimeType = function (mimeType) {
          this.strMimeType = mimeType;
        }
        
        /**
         * @ngdoc function
         * @name isIE
         * @methodOf  angular.download.service:downloadService
         * @description Checks whether current browser is IE and returns it's version if it is
         *
         * Original function from: https://github.com/angular-ui/ng-grid/blob/master/src/features/exporter/js/exporter.js
         */
        this.isIE = function () {
          var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
          return match ? parseInt(match[1]) : false;
        }
        
        /**
         * @ngdoc function
         * @name downloadFile
         * @methodOf  angular.download.service:downloadService
         * @param {string} fileName Name of the file that will be downloaded
         * @param {string} content Base64 encoded file content
         * @description Launch a file download witch specified filename and data
         *
         * Original function from: https://github.com/angular-ui/ng-grid/blob/master/src/features/exporter/js/exporter.js
         */
        this.downloadFile = function (fileName, content) {
            var D = document;
            var a = D.createElement('a');
            var rawFile;
            var ieVersion;

            ieVersion = this.isIE();
            if (ieVersion && ieVersion < 10) {
                var frame = D.createElement('iframe');
                document.body.appendChild(frame);

                frame.contentWindow.document.open("text/html", "replace");
                frame.contentWindow.document.write('sep=,\r\n' + content);
                frame.contentWindow.document.close();
                frame.contentWindow.focus();
                frame.contentWindow.document.execCommand('SaveAs', true, fileName);

                document.body.removeChild(frame);
                return true;
            }

            // IE10+
            if (navigator.msSaveBlob) {
                return navigator.msSaveBlob(
                    new Blob( [content], { type: this.strMimeType } ),
                    fileName
                );
            }

            //html5 A[download]
            if ('download' in a) {
                var blob = new Blob(
                    [content], { type: this.strMimeType }
                );
                rawFile = URL.createObjectURL(blob);
                a.setAttribute('download', fileName);
            } 
            else {
                rawFile = 'data:' + this.strMimeType + ',' + encodeURIComponent(content);
                a.setAttribute('target', '_blank');
            }

            a.href = rawFile;
            a.setAttribute('style', 'display:none;');
            D.body.appendChild(a);
            setTimeout(function() {
                if (a.click) {
                    a.click();
                // Workaround for Safari 5
                } 
                else if (document.createEvent) {
                    var eventObj = document.createEvent('MouseEvents');
                    eventObj.initEvent('click', true, true);
                    a.dispatchEvent(eventObj);
                }
                D.body.removeChild(a);
            }, this.delay);
        }
    }
    
    app.factory('fileDownloadService', 
        function(){
            return new FileDownload();
        }
    );
    
})();