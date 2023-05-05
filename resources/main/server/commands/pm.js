import * as alt from "alt-server";

alt.Utils.registerCommand({
    name: "pm",
    description: "Set specified player model",
    args: [
        {
            name: "model",
            description: "Model name or hash",
            required: true,
        },
    ],
    execute: (player, [model]) => {
        if (model) {
            player.model = model;
        } else {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/pm",
                message: "Syntaxe invalide\n/pm [nomDuModel]",
            });
        }
    },
});