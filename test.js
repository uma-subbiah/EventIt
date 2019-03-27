//var QUnit=require("qunit")
function IsMail(mail)
{   
    var regex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
    return (mail.replace(regex,"0")=="0");
}
QUnit.test( "mail validation", function( assert ) 
{
    assert.ok(IsMail("joe.tillis@unit.army.mil"), "Passed!" );
    assert.ok(IsMail("jack_rabbit@slims.com"), "Passed!" );
    assert.ok(IsMail("foo99@foo.co.uk"), "Passed!" );
    assert.ok(IsMail("find_the_mistake.@foo.org"), "Passed!" );
    assert.ok(IsMail(" .prefix.@some.net"), "Passed!" );
    assert.ok(IsMail("jack_rabbit@slims.comisjskkal"), "Passed!" );
});