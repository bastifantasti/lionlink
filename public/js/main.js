/**
 * Created by sebschwa on 30.03.17.
 */
$(document).ready(function () {
    let url, title, desc, tags;
    console.log('ready');

    $('#url').focus(function() {
        //
    }).blur(function(){
        let datastr = {
            url: $("#url").val()
        };
        $.ajax({
                url: '/getMeta',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datastr),
                beforeSend: function () {
                    console.log('before send');
                },
                success: function (data) {
                    console.log('success');
                    console.log(data);
                    let obj = JSON.parse(data);
                    data = obj.data;
                    if(obj.status === 200){
                        $('#inputDesc').text(data.desc);
                        $('#inputTitle').text(data.title);
                    }
                },
                error: function (result) {
                    console.log(result);
                }

            }
        );
    });

    $("#submit").click(function (ev) {
        ev.preventDefault();
        console.log('click');
        url = $("#url").val();
        title = $("#title").val();
        desc = $("#desc").val();
        tags = $("#tags").val();
        let datastr = {
            url: url,
            title: title,
            desc: desc,
            tags: tags
        };
        $.ajax({
                url: '/addLink',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(datastr),
                beforeSend: function () {
                    console.log('before send');
                },
                success: function (data) {
                    console.log('success');
                    console.log(data);
                },
                error: function (result) {
                    console.log(result);
                }

            }
        );

    });

    let input1 = document.querySelector('input[name=tags]'),
        tagify1 = new Tagify(input1, {
            duplicates : false,
            suggestionsMinChars : 1,
            maxTags             : 6,
            whitelist : ["CSS","HTML","ES6","JS","Angular","Sketh","Photoshop","UX","UI","Design","Frontend","Fullstack","Cloud","Tool","Service"],
            blacklist : ["fuck", "shit"]
        });

// listen to custom 'remove' tag event
    tagify1.on('remove', onRemoveTag);
    tagify1.on('add', onAddTag);

    function onRemoveTag(e){
        console.log(e, e.detail);
    }

    function onAddTag(e){
        console.log(e, e.detail);
    }
});