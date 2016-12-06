var searchBox = false;

function sanitizeMyQuery(query) {
  // Capitalize the first letter of the string 
  // and replace spaces with underscores.
  var queryArray = query.split("");
  queryArray[0] = queryArray[0].toUpperCase();
  for (var i = 1; i < queryArray.length; i++) {
    if (queryArray[i] == " ") {
      queryArray[i] = "_";
    } else {
      queryArray[i] = queryArray[i].toLowerCase();
    }
  }
  return queryArray.join("");
};

function searchWiki() {
  var query = $('#search-field').val();
  var sanitizedQuery = sanitizeMyQuery(query);
  var wikiRequest = new XMLHttpRequest();
  var request = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=15&namespace=-1%7C0&format=json&callback=?";
  //capitalize the first letter of each word in query and replace the spaces
  // with underscores, then add this to request.
  request += "&search=" + sanitizedQuery;
  
  $.ajax({
    type: "GET",
    url: request,
    contentType: "application/json; charset=utf-8;",
    dataType: "jsonp",
    success: function (wikiData) {
      //console.log(wikiData);
      
      // Clear the previous search
      $('#search-results').html("");
      
      // Insert the search results
      for (var i = 0; i < wikiData[1].length; i++) {
        var resultHtml = "";
        resultHtml += "<div style='display:none' class='hit'>";
        resultHtml += "<a href='"+wikiData[3][i]+"' target='_blank'>";
        resultHtml += "<p class='hit-title'>"+wikiData[1][i]+"</p>";
        resultHtml += "<p>"+wikiData[2][i]+"</p>";
        resultHtml += "</a></div>";
        //$(resultHtml).appendTo($('#search-results')).fadeIn('slow');
        $(resultHtml).appendTo($('#search-results'));
      }
      $('.hit').each(function(num) {
        $(this).delay(200*num).fadeIn(250);
      });
      
      // If returned array is empty, notify user that no search results available
      if (wikiData[1].length == 0) {
        var errorHtml = "<div style='display:none' class='hit hit-noresult'><p>Dang! No results...but feel free to try again with a different query.</p></div>";
        $(errorHtml).appendTo($('#search-results'));
        $('.hit-noresult').fadeIn(250);
      }
    },
    error: function (e) {
      alert(e +' : Error displaying search results!');
    }
  });
  


  // alert(wikiJSON.query.normalized.to);
};

function showSearchBox() {
    searchBox = true;
    $('#search-field-tool').prepend('<form id="search-form" action="javascript:searchWiki()" class="centering"><input id="search-field" type="text" name="search"/></form>');
    $('#search-field').width(380);    
    $('#svg-search-line').width(400);
    $('#search-icon').fadeOut('fast');
    changeSearchIcon('glyphicon-search', 'glyphicon-pencil');
    
    //$('#svg-search-line').attr('margin-top','0em');
    document.getElementById("search-field").focus();

}

function hideSearchBox() {
  searchBox = false;
  $('#search-field').width(0);
  $('#svg-search-line').width(80);
  if ( $('#search-icon').hasClass('glyphicon-pencil') ) {
    changeSearchIcon('glyphicon-pencil', 'glyphicon-search');
  } else {
    changeSearchIcon('glyphicon-remove', 'glyphicon-search');
  }

  $('#search-field').remove();

}

function changeSearchIcon(oldClass, newClass) {
  var searchIcon = $('#search-icon');
  searchIcon.fadeOut('fast');
  searchIcon.removeClass(oldClass);
  searchIcon.addClass(newClass);
  searchIcon.fadeIn('fast');
}


$(document).ready(function () {
  
  var searchUsed = false;
  
  $('body').on('keydown', '#search-field', function() {
    console.log($('#search-icon'));
    if ( $('#search-icon').hasClass('glyphicon-pencil') ) {
      changeSearchIcon('glyphicon-pencil', 'glyphicon-remove');
    }
 });
    
  $('#search-icon').on('click', function() {
    if (!searchBox) {
      showSearchBox();
    } else {
      hideSearchBox();
    }
   //  Toggle #panel-wrapper up or down
   if (searchUsed === false ){
      $('h1').css('margin-top','1em');
      searchUsed = true;
    } else {
      $('h1').css('margin-top','4em');
      searchUsed = false;
    }
    // Clear any previous search output when closing search area
    $('#search-results').html("");
  });
});
