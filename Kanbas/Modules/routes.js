import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app) {
    app.delete("/api/modules/:moduleId", async (req, res) => {
        const { moduleId } = req.params;
        const status = await modulesDao.deleteModule(moduleId);
        res.send(status);
    });

    app.put("/api/modules/:moduleId", async (req, res) => {
        try {
            const { moduleId } = req.params;
            const moduleUpdates = req.body;
            const status = await modulesDao.updateModule(moduleId, moduleUpdates);
            if (!status) {
                return res.status(404).json({ message: "Module not found" });
            }
            res.json(status);
        } catch (error) {
            console.error("Error updating module:", error);
            res.status(500).json({ message: "Error updating module" });
        }
    });
}



