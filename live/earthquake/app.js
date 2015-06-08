jQuery(document).ready(function($){

    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });

    var $reference = $("#item-reference");
    var source_spreadsheet_url = "https://spreadsheets.google.com/feeds/list/1EM4NUbLAEFCYtzbN_-NU08bx0Z2JiSHA2wckdMppfd0/1/public/values?alt=json-in-script&callback=?&_ts=" + (new Date()).getTime()

    function load_latest(){
        $.getJSON(source_spreadsheet_url, function(data){
            var records = {};
            $.each(data.feed.entry, function(i, row){
                var the_moment = moment(row.gsx$timestamp.$t, "M/D/YYYY HH:mm:ss"); 
                var uts = the_moment.unix();
                var sortkey = uts;
                while(records[sortkey])
                {
                    sortkey += "-";
                }
                var the_item = {
                    rawdate     :row.gsx$timestamp.$t,
                    moment      :the_moment,
                    nicedt      :the_moment.format("D-M-YYYY, h:mm A"),
                    body        :row.gsx$eventdescription.$t,
                    submitter   :row.gsx$submittersname.$t,
                    link        :row.gsx$sourcelink.$t
                };
                records[sortkey] = the_item;
            });

            var timestamps = $.map(records, function(element,index) {return index});
            timestamps = timestamps.sort().reverse();

            $feeditems = $(".feeditems").empty();
            $.each(timestamps, function(i, timestamp){
                var record = records[timestamp];
                var $segment = $reference.clone();

                $segment.removeClass("reference");
                html = $segment.html();
                if(html)
                {
                    html = html.replace("{rawdate}", record.rawdate);
                    html = html.replace("{nicedt}", record.nicedt);
                    html = html.replace("{body}", record.body);
                    if(!record.submitter)
                    {
                        record.submitter = "anon";
                    }
                    html = html.replace("{submitter}", record.submitter);
                    html = html.replace(/\{link\}/g, record.link);

                    $segment.html(html);
                    $segment.appendTo($feeditems);
                    $segment.show();
                }
            });
        });

        setTimeout(load_latest, 1000 * 180);
    }
    load_latest();
});