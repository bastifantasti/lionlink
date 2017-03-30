/**
 * Created by sebschwa on 30.03.17.
 */
$(document).ready(function(){
    let url,title,desc,tags;
    console.log('ready');
    $("#submit").click(function(){
        console.log('click');
        url=$("#url").val();
        title=$("#title").val();
        desc=$("#desc").val();
        tags=$("#tags").val();
        let datastr = {
            url: url,
            title: title,
            descdesc: desc,
            tags: tags
        };
        $.ajax({
            url: '/addLink',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datastr)
        }, function(data) {
                if (data === 'done') {
                    alert("link saved");
                }
            }
        );
        /*
        $.post("/addLink",{url: url,title: title,desc: desc,tags: tags}, function(data){
            if(data==='done')
            {
                alert("link saved");
            }
        });
        */
    });
});