function NotyMessage(noty){
    console.log(noty);
    if(noty.status == "success"){
        new Noty({
            theme:'relax',
            text:noty.message,
            type:'success',
            layout:'topRight',
            timeout:1500
        }).show();
    }

    if(noty.status == "error"){
        new Noty({
            theme:'relax',
            text:noty.message,
            type:'error',
            layout:'topRight',
            timeout:1500
        }).show();
    }
}