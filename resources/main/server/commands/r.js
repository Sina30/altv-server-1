import * as alt from "alt-server";

alt.Utils.registerCommand({
    name: "r",
    description: "Restart server or resource",
    args: [
        {
            name: "resourceName",
            description: "Name of the resource to restart",
            required: true,
        },
    ],
    permissionLevel: 4,
    execute: (player, [resourceName]) => {
        if (!resourceName) {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/r [resourceName]",
                message: "Vous devez spécifier le nom de la ressource à redémarrer.",
            });
        }

        if (alt.hasResource(resourceName)) {
            player.notify({
                imageName: "CHAR_MP_FM_CONTACT",
                headerMsg: `Restarting ${resourceName}...`,
            });
            alt.restartResource(resourceName);
        } else {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: `/${resourceName}`,
                message: "Cette ressource n'existe pas.",
            });
        }
    },
});