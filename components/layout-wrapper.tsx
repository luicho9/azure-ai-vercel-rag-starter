"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { useMediaQuery } from 'react-responsive';

const LayoutWrapper = ({ isDrawerOpen, onCloseDrawer, children, currentCitation }: { isDrawerOpen: boolean; onCloseDrawer: () => void; children: React.ReactNode; currentCitation: string; }) => {
    const isMobileQuery = useMediaQuery({ maxWidth: 768 });
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const citationPanelRef = useRef<ImperativePanelHandle>(null);

    useEffect(() => {
        setIsMobile(isMobileQuery);
    }, [isMobileQuery]);

    useEffect(() => {
        if (isDrawerOpen) {
            citationPanelRef.current?.expand();
        } else {
            citationPanelRef.current?.collapse();
        }
    }, [isDrawerOpen]);

    // Render a consistent structure for hydration
    return (
        <>
            <div>
                {children}
            </div>
            {isMobile === null ? null : (
                isMobile ? (
                    <Drawer open={isDrawerOpen} onOpenChange={onCloseDrawer}>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Citation Details</DrawerTitle>
                                <DrawerDescription className="h-[50vh] overflow-y-auto">
                                    {currentCitation || "No citation selected."}
                                </DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Button onClick={onCloseDrawer}>Close</Button>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={75}>
                            <div className="flex flex-col min-w-0 h-screen bg-background">
                                {children}
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel collapsible collapsedSize={0} ref={citationPanelRef} defaultSize={25}>
                            <div className="p-4 overflow-y-scroll h-screen">
                                {currentCitation ? (
                                    <div>
                                        <h3 className="font-bold">Citation Details:</h3>
                                        <p>{currentCitation}</p>
                                    </div>
                                ) : (
                                    <p>Select a citation to view details</p>
                                )}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                )
            )}
        </>
    );
};

export default LayoutWrapper;
