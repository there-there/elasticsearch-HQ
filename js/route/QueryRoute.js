/*
 Copyright 2013 Roy Russo

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Latest Builds: https://github.com/royrusso/elasticsearch-HQ
 */


var queryRoute = {};

/**
 * The initial query screen
 */
queryRoute.init = function () {

    var clusterState = cluster.get("clusterState").toJSON();
    var indices = clusterState.metadata.indices;
    console.log(clusterState);

    var queryView = new QueryView({model:indices});
    queryView.render();
};

/**
 * Performs the query validation and delegates to the API
 */
queryRoute.doQuery = function () {

    // get checked checkboxes and query string
    var indices = new Array();
    $('#checkboxindices input:checked').each(function () {
        indices.push($(this).attr('name'));
    });

    var indexCSV = "";
    if (indices.length > 0) {
        indexCSV = indices.join(",");
        $("#queryError-loc").empty();
    }
    else { // error on no indices.
        var errModel = new ErrorMessageModel({warningMessage:'', warningTitle:'Index is required!'});
        var errorMsgView = new ErrorMessageView({el:$("#queryError-loc"), model:errModel});
        errorMsgView.render();
        return;
    }

    var queryString = $('#queryString').val();
    var perPage = $('#perPage option:selected').val();

    // prep model., we dont use backbone connection in this case.
    var queryModel = new QueryModel({indexCSV:indexCSV, queryString:queryString});
    queryModel.get('queryObj').size = Math.floor(perPage);

    // issue jquery ajax POST then render
    var documentListView = new DocumentListView({model:queryModel});
    documentListView.render();
};