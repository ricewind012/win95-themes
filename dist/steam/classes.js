let classes = {};
new Set([...document.querySelectorAll('[rel="stylesheet"]')]
    .map((e) => [...e.sheet.cssRules])
    .flatMap((e) => e.map((e) => e.selectorText))
    .flatMap((e) => e?.match(/_[\w-]{5}(::(before|after))?$/) &&
    e
        .match(/\.[\w-]+/g)
        ?.filter((e) => e.includes("_") && !e.match(/^\._?Dialog/)))
    .filter(Boolean)
    .map((e) => e.replace(".", ""))).forEach((e) => {
    let classnorm = e.replace(/_[\w-]{5}$/, "");
    let namespace = classnorm.replace(/_[a-zA-Z]+$/, "");
    let classname = classnorm.replace(`${namespace}_`, "");
    if (!classes[namespace])
        classes[namespace] = {};
    classes[namespace][classname] = e;
});
export default classes;
